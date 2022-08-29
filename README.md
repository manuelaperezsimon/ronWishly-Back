USER ENDPOINTS

[POST] /users/register -> registrará al usuario y se guardará en la BD
STATUS: 201

[POST] /users/login -> iniciará sesión el usuario y se creará el token
STATUS: 200

WISHES ENDPOINTS

[GET] /wishes -> devuelve un array con todos los wishes de la BD
Y tendrá un query param: qué página y filtro
STATUS: 200

[GET] /wishes/:id -> devuelve un wish detail de la BD por id
STATUS: 200

[POST*] /wishes/create -> recibe un wish (sin id), lo crea en la BD y devuelve el wish recién creado
STATUS: 201

[PUT*] /wishes/modify/:id -> recibe un wish, modifica en la BD el wish con la misma id que el recibido, y devuelve el wish modificado
STATUS: 201

[DELETE*] /wishes/delete/:id -> elimina de la BD un wish por id
STATUS: 201

STATUS ERRORES=

- 400: Bad Request
- 404: Not found
- 409: Conflicts
- 500: Internal Server Error
