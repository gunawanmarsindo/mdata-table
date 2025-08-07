# Panduan Publishing Package ke NPM

## Langkah 1: Persiapan

### 1.1 Pastikan Build Berhasil
```bash
npm run build:lib
```

### 1.2 Test Package
```bash
npm pack --dry-run
```

## Langkah 2: Setup NPM Account

### 2.1 Buat Account NPM (jika belum punya)
- Buka https://www.npmjs.com/
- Klik "Sign Up" 
- Isi form registrasi
- Verifikasi email

### 2.2 Login ke NPM via Terminal
```bash
npm login
```
- Masukkan username NPM
- Masukkan password 
- Masukkan email
- Masukkan OTP jika diminta

### 2.3 Cek Login Status
```bash
npm whoami
```

## Langkah 3: Cek Nama Package

### 3.1 Cek Ketersediaan Nama
```bash
npm view mdata-table
```

Jika package sudah ada, Anda perlu:
- Ganti nama di package.json, atau
- Gunakan scoped package: `@username/mdata-table`

### 3.2 Jika Nama Sudah Digunakan
Edit package.json:
```json
{
  "name": "@marsindo/mdata-table",
  "version": "1.0.0"
}
```

## Langkah 4: Publish Package

### 4.1 Publish Public Package
```bash
npm publish
```

### 4.2 Publish Scoped Package (jika menggunakan @username)
```bash
npm publish --access public
```

### 4.3 Publish dengan Tag (opsional)
```bash
npm publish --tag beta
```

## Langkah 5: Verifikasi

### 5.1 Cek di NPM Website
- Buka https://www.npmjs.com/package/mdata-table
- atau https://www.npmjs.com/package/@marsindo/mdata-table

### 5.2 Test Install Package
```bash
# Di folder lain
npm install mdata-table
# atau
npm install @marsindo/mdata-table
```

## Update Package di Masa Depan

### 1. Update Version
```bash
npm version patch  # untuk bug fixes (1.0.0 -> 1.0.1)
npm version minor  # untuk new features (1.0.0 -> 1.1.0)  
npm version major  # untuk breaking changes (1.0.0 -> 2.0.0)
```

### 2. Build dan Publish
```bash
npm run build:lib
npm publish
```

## Tips Penting

1. **Always Test**: Selalu test package di project lain sebelum publish
2. **Semantic Versioning**: Gunakan semantic versioning (semver)
3. **Documentation**: Pastikan README.md lengkap dan jelas
4. **Dependencies**: Pastikan semua dependencies sudah benar
5. **Files**: Hanya include file yang diperlukan di package

## Troubleshooting

### Error: Package name too similar
- Ganti nama package menjadi lebih unique
- Gunakan scoped package

### Error: You must be logged in
```bash
npm login
```

### Error: 402 Payment Required
- Package name mungkin premium, gunakan nama lain

### Error: 403 Forbidden
- Nama package sudah dimiliki orang lain
- Gunakan nama yang berbeda atau scoped package
