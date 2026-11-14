# 그래플로그 Android 업로드 키와 서명된 AAB

첫 Play 출시는 무료 앱입니다. 서명 방식은 유료와 같고, 가격은 Play Console에서 정합니다. 이 문서는 키를 만들거나 Play에 올리는 작업을 대신하지 않습니다. 키스토어와 비밀번호는 저장소에 넣지 않습니다.

앱 서명 키는 Google Play App Signing이 보관합니다. 우리가 보관하는 것은 **업로드 키**뿐입니다. 첫 AAB를 올리면 Play가 앱 서명 키를 만들고, 이후 업로드는 항상 같은 업로드 키로 서명합니다.

## 1. 업로드 키를 저장소 밖에서 만들기

JDK의 `keytool`을 사용합니다. 아래 명령은 **저장소 디렉터리 밖에서** 실행하세요. `-storepass`와 `-keypass`는 쉘 기록에 남으므로 넣지 않습니다. `keytool`이 비밀번호와 이름(CN)을 물어봅니다. CN은 `그래플로그` 또는 본인 이름이면 됩니다.

```bash
mkdir -p "$HOME/keystores"
chmod 700 "$HOME/keystores"
keytool -genkeypair -v \
  -keystore "$HOME/keystores/grapplelog-upload.jks" \
  -storetype PKCS12 \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
chmod 600 "$HOME/keystores/grapplelog-upload.jks"
```

- 별칭(`upload`)은 아래 `ANDROID_UPLOAD_KEY_ALIAS`와 같아야 합니다.
- 스토어 비밀번호와 키 비밀번호는 같게 해도 됩니다. 비밀번호 관리자에 저장하세요.
- Java 21의 기본 형식은 PKCS12입니다. 확장자가 `.jks`여도 됩니다.
- 유효 기간 10000일은 Google 업로드 키 예시와 같습니다.
- 이 파일을 잃어버리면 Play Console에서 업로드 키 재설정을 요청해야 합니다. 앱 서명 키는 Google이 갖고 있어 우리가 재발급하지 않습니다.

## 2. 빌드에 키 정보 넘기기

비밀번호는 다음 두 곳에서만 읽습니다. Gradle `-P` 속성이나 저장소 안 파일로는 받지 않습니다.

같은 항목이 둘 다 있으면 **환경변수가 우선**합니다.

| 항목 | 환경변수 | `android/keystore.properties` |
| --- | --- | --- |
| 키스토어 경로 | `ANDROID_UPLOAD_STORE_FILE` | `storeFile` |
| 스토어 비밀번호 | `ANDROID_UPLOAD_STORE_PASSWORD` | `storePassword` |
| 키 별칭 | `ANDROID_UPLOAD_KEY_ALIAS` | `keyAlias` |
| 키 비밀번호 | `ANDROID_UPLOAD_KEY_PASSWORD` | `keyPassword` |

로컬에서는 예시 파일을 복사해 쓰는 편이 단순합니다.

```bash
cp android/keystore.properties.example android/keystore.properties
chmod 600 android/keystore.properties
```

`storeFile`은 저장소 밖 절대 경로를 권장합니다 (`/home/.../keystores/grapplelog-upload.jks` 또는 `~/keystores/grapplelog-upload.jks`). 상대 경로는 `android/` 기준입니다.

CI나 일회성 셸에서는 환경변수만으로도 됩니다.

```bash
export ANDROID_UPLOAD_STORE_FILE="$HOME/keystores/grapplelog-upload.jks"
export ANDROID_UPLOAD_STORE_PASSWORD='(비밀번호 관리자에서 붙여넣기)'
export ANDROID_UPLOAD_KEY_ALIAS='upload'
export ANDROID_UPLOAD_KEY_PASSWORD='(비밀번호 관리자에서 붙여넣기)'
```

값을 비우거나 일부만 채우면 릴리스 빌드는 어떤 항목이 비었는지 이름만 보여주고 멈춥니다. 비밀번호 값은 로그에 찍지 않습니다. 경로의 파일이 없으면 그 경로를 보여주고 멈춥니다.

키가 전혀 없어도 `assembleDebug`는 디버그 키스토어로 빌드됩니다. `assembleRelease`, `bundleRelease`, `packageRelease`, `installRelease`, 그리고 릴리스를 포함하는 `build`는 실패합니다.

환경변수를 바꾼 뒤 반영이 안 되면 데몬이 이전 환경을 들고 있는 것입니다.

```bash
cd android && ./gradlew --stop
```

`keystore.properties`는 매 설정 때마다 다시 읽습니다.

## 3. 버전

Play는 `versionCode`(정수, 업로드마다 증가)와 사용자에게 보이는 `versionName`을 구분합니다.

기본값은 `versionName` `1.0.0`, `versionCode` `10000`입니다. 코드를 직접 주지 않으면 이름에서 계산합니다.

```text
MAJOR * 10000 + MINOR * 100 + PATCH
```

| versionName | versionCode |
| --- | --- |
| 1.0.0 | 10000 |
| 1.0 | 10000 |
| 1.2.3 | 10203 |
| 2.0.0 | 20000 |

`1.0`과 `1.0.0`은 같은 코드입니다. minor와 patch는 0–99만 자동 계산합니다. 그 밖의 이름은 `versionCode` 1로 두고 경고합니다.

우선순위는 환경변수, Gradle 속성, 기본값 순입니다.

| 항목 | 환경변수 | Gradle 속성 |
| --- | --- | --- |
| versionName | `ANDROID_VERSION_NAME` | `-PANDROID_VERSION_NAME` 또는 `-PversionName` |
| versionCode | `ANDROID_VERSION_CODE` | `-PANDROID_VERSION_CODE` 또는 `-PversionCode` |

```bash
cd android
ANDROID_VERSION_NAME=1.1.0 ./gradlew bundleRelease
./gradlew bundleRelease -PANDROID_VERSION_NAME=1.1.0 -PANDROID_VERSION_CODE=10100
```

직접 주는 `versionCode`는 1 이상 2100000000 이하의 정수여야 합니다. 이미 Play에 올린 코드보다 커야 다음 업로드가 됩니다.

설정 로그에 한 줄이 남습니다. 비밀번호는 포함되지 않습니다.

```text
[그래플로그] versionName=1.0.0 (default), versionCode=10000 (versionName 1.0.0 → MAJOR*10000+MINOR*100+PATCH), releaseSigning=missing
```

## 4. 서명된 AAB 만들기

웹은 원격 URL을 로드하므로, 네이티브 쪽을 바꾼 뒤라면 한 번 동기화합니다.

```bash
pnpm install
npx cap sync android
cd android
./gradlew bundleRelease
```

결과 파일:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

`*.aab`와 `build/`는 gitignore입니다. `minifyEnabled`는 꺼 두었습니다. Capacitor 플러그인 keep 규칙이 비어 있어 R8을 켜면 릴리스에서 브리지가 깨질 수 있습니다. 검증 전에는 켜지 마세요.

디버그 확인:

```bash
cd android && ./gradlew assembleDebug
```

## 5. Play Console에 올리기 전에

1. Play Console에서 앱을 만듭니다. 패키지명 `com.aqua.bjjapp`, 앱 이름 `그래플로그`.
2. 신규 앱은 Play App Signing이 필수입니다. 앱 서명 키를 직접 만들지 말고, Google이 생성·보관하게 둡니다.
3. 비공개 테스트 트랙에 위에서 만든 AAB를 업로드합니다. 이 AAB는 업로드 키로 서명되어 있고, 기기 배포본은 Google이 앱 서명 키로 다시 서명합니다.
4. 업로드 키 인증서 지문이 필요하면 저장소 밖에서 확인합니다. `keytool -list -v -keystore "$HOME/keystores/grapplelog-upload.jks" -alias upload`
5. 키스토어와 `keystore.properties` 백업은 비밀번호 관리자와 오프라인 복사본에만 둡니다.

`google-services.json`(Firebase/FCM)도 gitignore입니다. 파일이 없으면 푸시 플러그인만 빠지고 앱 빌드는 계속됩니다.
