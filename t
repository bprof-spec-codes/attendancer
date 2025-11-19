[33m6cc268b[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfeature/user-signed-sheets-backend[m[33m)[m Add migration for ExpirationDate field in Event
[33m0133332[m Add Get endpoint for signed sheets in UserController
[33m593f78c[m Move GetSignedSheetsAsync to UserService for better architecture
[33m615c2f6[m Add GetSignedSheetsAsync method to ParticipantService
[33m7891fb8[m Add EventSignedByUserViewDto for user's signed sheets
[33ma8c3260[m[33m ([m[1;31morigin/develop[m[33m, [m[1;32mdevelop[m[33m)[m Merge pull request #95 from bprof-spec-codes/refactor/UI_Bootstrap
[33m159d00d[m fix conflict
[33maffb05b[m Merge branch 'develop' into refactor/UI_Bootstrap
[33mf273d89[m Merge pull request #94 from bprof-spec-codes/feature/87-mock-interceptor
[33m9cf8f4f[m Merge pull request #90 from bprof-spec-codes/feature/signed-sheet-view
[33m97cb7a6[m[33m ([m[1;31morigin/feature/signed-sheet-view[m[33m)[m Merge branch 'develop' into feature/signed-sheet-view
[33m3ea79e0[m Merge pull request #89 from bprof-spec-codes/feature/login-val
[33m6736321[m[33m ([m[1;31morigin/feature/login-val[m[33m)[m Merge branch 'develop' into feature/login-val
[33mee3136b[m Merge pull request #88 from bprof-spec-codes/feature/user-crud-api
[33m4df3eb6[m Merge pull request #86 from bprof-spec-codes/feature/Qr-code
[33m30196cd[m Fixed the whitespace issue under footer, added labels for registration and login and unified the nav links
[33m3de5fb8[m[33m ([m[1;31morigin/feature/user-crud-api[m[33m, [m[1;32mfeature/user-crud-api[m[33m)[m Add ActiveUserMiddleware to validate user deleted status on every request
[33m38ef948[m Implement soft delete for register with reactivation support
[33m34f0e6b[m User service updated for soft delete
[33ma3407de[m Merge branch 'feature/user-soft-delete' into feature/user-crud-api Merge soft delete feature into user-crud-api branch
[33m0d5efe7[m[33m ([m[1;32mfeature/user-soft-delete[m[33m)[m Add migration for User soft delete properties
[33m4b75ccc[m Add soft delete properties to User entity
[33m1e6281e[m Fixed the center alignment issues, data missmatch and Authentication(?)
[33m2fdfccc[m Refactored the components with Bootstrap classes, created a field for user data edits
[33mc6c3afb[m remove logout functionality from navigation component
[33mccb9ecb[m fix typo
[33m2c4edb9[m[33m ([m[1;31morigin/feature/87-mock-interceptor[m[33m)[m add mock data interceptor
[33maaa3f6d[m[33m ([m[1;31morigin/feature/userdata-change[m[33m)[m Merge pull request #85 from bprof-spec-codes/feature/65-delete-sheet-frontend
[33m70863db[m add signed sheets for profile with mock data
[33m66a7f79[m Add GET /api/user/me endpoint and allow viewing other user profiles
[33m92558d7[m Change in Startup to enable JWT auth
[33m9769315[m Add User Crud endpoints to UserController
[33m1304b3c[m Add user mappings to DtoProvider
[33md9e95bc[m Add User Crud methods to UserService
[33mcaecbc7[m Add User Crud DTOs
[33m6adfd8c[m modify NSwag config
[33ma630c05[m enhance login and registration forms with validation and error handling
[33ma7b5a71[m add Angular language service and enhance registration form validation
[33m252d7c8[m implement logout functionality in navigation
[33mbee82d1[m Qr validate and invalidate added
[33maba7aa5[m Qr endpoints added
[33m555553b[m QrService added
[33mb3baff3[m getall and create Event endpoints added
[33maa272a6[m[33m ([m[1;31morigin/feature/65-delete-sheet-frontend[m[33m)[m add warning modal for confirming delete sheet
[33m790cf7e[m remove empty metadata from array in create sheet
[33m27ada1f[m fix nav login link
[33m3c6567e[m refact nav for auth check
[33mf269317[m add delete function to sheet with auth check
[33m1308ec4[m simple code refact
[33m4542b53[m Merge pull request #74 from bprof-spec-codes/feature/63-create-sheet-frontend
[33m6a2cce8[m[33m ([m[1;31morigin/feature/63-create-sheet-frontend[m[33m)[m Merge branch 'develop' into feature/63-create-sheet-frontend
[33m6d2de10[m Merge pull request #75 from bprof-spec-codes/bugfix/36-end-to-end-test
[33mc1dda71[m[33m ([m[1;31morigin/bugfix/36-end-to-end-test[m[33m)[m fix registration
[33m6041bbd[m Merge pull request #67 from bprof-spec-codes/feature/UI_Bootstrap
[33m16305cc[m[33m ([m[1;31morigin/feature/UI_Bootstrap[m[33m)[m Merge branch 'develop' into feature/UI_Bootstrap
[33m542dc5f[m fix login
[33md216388[m fix user passwords and launch url
[33mf6e4790[m fix database migrations
[33m7a1cf90[m Merge pull request #69 from bprof-spec-codes/feature/user-reg
[33ma5dc7b2[m[33m ([m[1;31morigin/feature/user-reg[m[33m)[m Merge branch 'develop' into feature/user-reg
[33m8d9c01f[m add very simple validation for create sheet
[33m36068ee[m database refacted and Qr validation added
[33mc4b17dd[m Merge branch 'develop' into feature/UI_Bootstrap
[33m85a07d8[m tiny code fix
[33ma6acc7e[m modify create sheet with mock data
[33ma68e44d[m add mock data for create sheet
[33m6479135[m fix SheetForm import error
[33m491d998[m Merge pull request #68 from bprof-spec-codes/feature/20-attendance-sheet-frontend
[33m3bfba74[m[33m ([m[1;31morigin/feature/20-attendance-sheet-frontend[m[33m)[m Merge branch 'develop' into feature/20-attendance-sheet-frontend
[33mbe5d5c9[m Installed Bootstrap, Made the profile component with bootstrap. Other components will use that too
[33me3f18e3[m feat: enhance login functionality with error handling and delayed navigation
[33md063707[m feat: implement auth guard for createSheet route and refactor logout handling
[33m6153643[m feat: refactor registration form to use reactive forms for first and last name fields
[33m2485f75[m Merge branch 'feature/user-reg' of github.com:bprof-spec-codes/attendancer into feature/user-reg
[33mb3cffb5[m feat: update API endpoints in environment files and refactor registration and login components for improved error handling and validation
[33mbe2c17b[m feat: initialize environment configuration with API endpoints and token key
[33mfe4df94[m feat: enhance registration form with error and success message handling, and improve input validation
[33m3e70795[m feat: update login form to use ngModel for two-way data binding and enhance validation logic
[33mecf4c75[m feat: add authGuard implementation for route protection
[33mb531433[m feat: implement logout functionality and enhance token management in AuthService
[33mceb9dbe[m refactor: clean up AuthService methods and ensure proper token handling in login
[33m246fefa[m feat: enhance authentication models and implement registration logic in AuthService
[33ma62fdba[m refactor: update environment configurations and remove unused auth models
[33m0d2c1d1[m refactor: update AppModule to include HttpClientModule and enhance Registration component with form handling
[33m54574ea[m add initial AuthService and its test suite
[33m9836b93[m feat: update API endpoints in environment files and refactor registration and login components for improved error handling and validation
[33m4c961c9[m show event sheet by id
[33maf08f1e[m small code refact
[33m535e5de[m Merge branch 'develop' into feature/20-attendance-sheet-frontend
[33m5adc712[m Merge pull request #47 from bprof-spec-codes/feature/UI
[33me26ca4a[m Merge branch 'develop' into feature/UI
[33mbaadf4f[m Merge pull request #46 from bprof-spec-codes/feature/jelenléti_ív_CRUD
[33mf47c055[m Merge pull request #43 from bprof-spec-codes/feature/jwt-auth
[33m6e1622d[m Merge pull request #45 from bprof-spec-codes/44-loading-interceptor-indicator
[33m25830be[m feat: initialize environment configuration with API endpoints and token key
[33m40d6127[m feat: enhance registration form with error and success message handling, and improve input validation
[33mcfe0ef7[m feat: update login form to use ngModel for two-way data binding and enhance validation logic
[33mddfe400[m feat: add authGuard implementation for route protection
[33md6b9b81[m feat: implement logout functionality and enhance token management in AuthSer