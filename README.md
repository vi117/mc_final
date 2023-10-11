# Happy tails

> 멀티캠퍼스 프론트엔드 과정 최종 프로젝트\
> 개발 기간: 2023-09-01~2023-10-13

## 프로젝트 소개

이 프로젝트는 반려동물과 관련된 문제들을 해결하기 위한 단체, 사람들을 크라우드 펀딩을 통해 효율적으로 지원하는 웹사이트를 만드는 것입니다.

### 팀원 소개

|       |백재웅| 이해연| 당현진|한윤희| 천서준|
|-------|-----|----|----|----|----|
|역할   |PL | 팀원 | 팀원 | 팀원 | PM|

### 개발 환경 및 기술

이 프로젝트에서 백엔드는 `kysely`, `mysql`, `express`, `typescript`으로 만들었고
프론트엔드는 `vite`, `SWR`, `react-bootstrap`, `quill`등으로 만들었습니다.

## Getting Start

```bash
$ git clone https://github.com/vi117/mc_final
$ cd mc_final
```
먼저 위와 같이 복제해야 합니다.

```bash
$ npm install
```
위를 실행해서 패키지를 설치하세요.

그 다음으로는 `frontend`와 `backend`에 `.env` 파일을 설정해주세요.
설정하는 방법은 [Backend의 README.md](https://github.com/vi117/mc_final/blob/main/packages/backend/README.md)와 [Frontend의 README.md](https://github.com/vi117/mc_final/blob/main/packages/frontend/README.md)를 읽어주세요. 

```bash
$ npm run -w backend dev
```

```bash
$ npm run -w frontend dev
```
이제 위 두 명령을 각각 다른 터미널에서 실행해 주세요.

## Contribution

### Pull Request

PR를 서술적인 제목으로 만들어 주세요.

좋은 타이틀의 예제:

* fix(user): Fix race condition in server
* docs(login): Update docstrings
* feat(funding): Handle nested messages

나쁜 타이틀의 예제:

* fix #7123
* update docs
* fix bugs
