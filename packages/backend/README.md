# Joinify Backend

## Start

디버깅 로그를 위해서 `.env` 파일을 만든다음

```bash
PORT=3000
DEBUG='joinify:servers'

DATABASE_URL=mysql://{아이디}:{패스워드}@{DB주소}/{DB이름}

JWT_SECRET=아무_문자열

SMTP_USER=admin
SMTP_PASSWORD=admin
SMTP_HOST=prelude.duckdns.org
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_FROM='no-reply@mailhog.prelude.duckdns.org'
```

를 넣어 저장하고 실행하세요.
