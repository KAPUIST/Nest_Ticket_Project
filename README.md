# 공연 예약 시스템

이 프로젝트는 NestJS와 TypeORM을 사용하여 개발된 공연 예약 시스템입니다. 이 시스템은 사용자 관리, 공연 관리, 좌석 예매, 예매 취소, 공연 검색 등의 기능을 제공합니다.

- [배포주소](http://43.201.51.91:3000/api/performances)
- [API SWAGGER](http://43.201.51.91:3000/api-docs)

## 주요 기능

- 사용자 회원가입 및 로그인 (JWT 인증)
- 사용자 프로필 조회 및 수정
- 공연 등록 (관리자 권한 필요)
- 공연 목록 조회 및 검색
- 공연 상세보기
- 좌석 예매 및 예매 취소
- 예매 내역 조회
- 예매 가능 좌석 조회
- 예매 시 포인트 차감 및 환불
- Swagger를 사용한 API 문서화

## 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-repo/performance-booking-system.git
cd performance-booking-system
```

### 2.의존성 설치

```bash
yarn
```

### 3.환경변수 설정

```env
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_SYNC=true
ACCESS_SECRET_KEY=your_access_secret_key
ACCESS_EXPIRES_IN="10m"
REFRESH_SECRET_KEY=your_refresh_secret_key
REFRESH_EXPIRES_IN="7d"
```

### 4.데이터베이스 생성

```sql
create databases your_database_name
```

### 5.서버 실행

```bash
yarn start:dev
```

### 6.API 문서

Swagger를 사용한 API 문서는 http://localhost:3000/api-docs에서 확인할 수 있습니다. 여기에는 모든 엔드포인트와 요청 및 응답 형식에 대한 자세한 정보가 포함되어 있습니다.
