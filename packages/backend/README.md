# Joinify Backend

## Getting Start

`.env` 파일을 만든다음

```bash
PORT=3000
DEBUG='joinify:servers'

DATABASE_URL=mysql://{아이디}:{패스워드}@{DB주소}/{DB이름}

JWT_SECRET=아무_문자열
```
를 넣어 저장하고 실행하세요.

## Config

기본 설정
- PORT: 서버가 열릴 포트 주소입니다.
- DEBUG: 디버그 로그의 범위입니다. 자세한 내용은 [여기](https://github.com/debug-js/debug)를 참조하세요.
- DATABASE_URL: mysql서버의 주소입니다. `mysql://{아이디}:{패스워드}@{DB주소}/{DB이름}` 형식에 맞춰서 넣으면 됩니다.
- JWT_SECRET: 로그인 jsonwebtoken의 키입니다. 임의의 문자열로 초기화하세요. `openssl rand -hex 20` 으로 생성하길 권장합니다.

SMTP 이메일 서버 설정
  - SMTP_USER: SMPT 유저 이름
  - SMTP_PASSWORD: SMPT 패스워드
  - SMTP_PORT: SMPT 포트 번호
  - SMTP_HOST: SMPT 주소
  - SMTP_SECURE: SMPT의 TLS 사용 여부
  - SMTP_FROM: 사용자 보내는 주소
- STORAGE_TYPE: 'minio', 'local', 'local_memory' 중 하나. 기본값은 local_memory
  - 만약 minio를 선택했으면 S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT, S3_BUCKET, S3_USE_SSL룰 설정해야 한다.

Google OAuth를 설정할려면 다음 키를 설정한다.
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - GOOGLE_REDIRECT_URI