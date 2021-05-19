# Authefy SDK
An Authefy software development kit for javascript. Simplifies the use of Authefy endpoints by providing set of libraries that are familiar for javascript developers. It also supports cross-runtime client service that can run on browser and Node.js server without code change.

## Build

`npm run build` transpiles the `*.ts` from `src` to `build` and updates `dist` files 

## Installation

To use with node:

```bash
$ npm install &lt;package&gt;
```

Then import sdk:

```typescript
import * as authefy from &lt;package&gt;
```

We are currently supporting `esm` and `umd`. To use it directly in the browser:

download the desired module from [here](https://github.com/HighOutputVentures/insignia-sdk/tree/master/dist ). e.g.

```bash
wget https://github.com/HighOutputVentures/insignia-sdk/blob/master/dist/umd/index.min.js
```

Then import the library from browser: 

```html
// umd
&lt;script src="./umd/index.min.js"&gt;&lt;/script&gt;

// esm
&lt;script type="module"&gt;
    import * as authefy from "./esm/index.js" 
&lt;/script&gt;
```

## Documentation

### Class: `BitClout`

Handles the bitclout identity api. 

- #### **Constructor: BitClout(opts)**

  - `opt` &lt;Object&gt;
    - `api` &lt;string&gt;  Bitclout Identity API url. default: https://identity.bitclout.com
    - `test` &lt;boolean&gt; Use testnet network for window.open requests

  ```typescript
  import { BitClout } from &lt;package&gt;
  const bitclout = new BitClout();
  ```

- #### **Method: sendInfoSync**

  - Returns: &lt;Promise&gt; Fufills with `{ hasStorageAccess: boolean; browserSupported: boolean }` upon success.

  ```typescript
  console.log(await bitclout.sendInfoSync())
  // { hasStorageAccess: true, browserSupported: true }
  ```

- #### **Method: sendJWTSync(payload)**

  - `payload` &lt;Object&gt;
    - `accessLevel` &lt;number&gt;
    - `accessLevelHmac` &lt;string&gt;
    - `encryptedSeedHex` &lt;string&gt;

  - Returns:&lt;Promise&gt; Fufills with `string` upon success.

  ```typescript
  console.log(await bitclout.sendJWTSync({
  	accessLevel: 4,
  	accessLevelHmac: 'hmac123',
  	encryptedSeedHex: 'seedHex123'
  }))
  // eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g
  ```

- #### **Method: logoutAsync(publicKey)**

  - `publicKey` &lt;string&gt;

  - Returns:&lt;Promise&gt; Fufills with `boolean` upon success.

  ```typescript
  console.log(await bitclout.logoutAsync('pubKey123'))
  // true
  ```
  
- #### **Method: loginAsync(accessLevel)**

  - `accessLevel` &lt;number&gt;

  - Returns: &lt;Promise&gt; Fufills with `{ token: string; publicKey: string }` upon success.

  ```typescript
  console.log(await bitclout.loginAsync())
  // { publicKey: 'pubKey123', token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g' }
  ```

### Class: `WebClient`

Handles functions for client's frontend side.

- #### **Constructor: WebClient(opts)**

  - `opt` &lt;Object&gt;
    - `appId` &lt;string&gt; application id (required)
    - `host` &lt;string&gt;  Authefy API url.
    - `test` &lt;boolean&gt; Use testnet network for bitclout api

  ```typescript
  import { WebClient } from &lt;package&gt;
  const authefyWebClient = new WebClient({ appId: 'app123' });
  ```

- #### **Getter: bitclout**

  - Returns: [&lt;BitClout&gt;](https://github.com/iammeosjin/http-server/blob/master/README.md#class-bitclout) 

- #### **Getter: user**

  - **Method: create(input)**
    - `input` &lt;Object&gt;
      -  `username` &lt;string&gt; (required)
      - `password` &lt;string&gt; (required)
      - `externalId` &lt;string&gt; user reference under application
      - `groups` &lt;string[]&gt; groups id in array
      - `details` &lt;Object&gt; user additional information
      
    - Returns:&lt;Promise&gt; Fufills with &lt;[User](https://github.com/iammeosjin/http-server/blob/master/README.md#object-user)&gt; upon success. 
    
      ```typescript
      await authefyWebClient.user.create({ username: 'john', password: 'doe' })
      // [Object] User 
      ```

- #### **Getter: token**

  - **Method: authenticate(input)**

    - `input` &lt;Object&gt;

      -  `oneOf` &lt;Object&gt;  (required)
          -  `grantType` &lt;'bitclout'&gt; 
              -  `token` &lt;string&gt;
              -  `publicKey` &lt;string&gt;
          -  `grantType` &lt;'password'&gt; 
              -  `username` &lt;string&gt;
              -  `password` &lt;string&gt;
          -  `grantType` &lt;'refreshToken'&gt; 
              -  `refreshToken` &lt;string&gt;

    - Returns: &lt;Promise&gt; Fufills with `{ accessToken: string; refreshToken?: string; expiresIn: number; }` upon success. 

      ```typescript
      await authefyWebClient.token.authenticate({ 
        grantType: 'bitclout', 
        token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', 
        publicKey: 'pubKey123' 
      })
      await authefyWebClient.token.authenticate({ 
        grantType: 'password', 
        username: 'john', 
        password: 'doe' 
      })
      await authefyWebClient.token.authenticate({ 
        grantType: 'refreshToken', 
        refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g'
      })
      // { accessToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', expiresIn: 60000 }
      ```
  - **Method: revoke(input)**

    - `input` &lt;Object&gt;

      -  `refreshToken` &lt;string&gt;  (required)

    - Returns: &lt;Promise&gt; Fufills with `boolean` upon success. 

      ```typescript
      await authefyWebClient.token.revoke({ 
        refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g'
      })
      // true
      ```
    

### Class: `ServerClient`

*Works only in NodeJS runtime.*
  Handles functions for client's server side.
- #### **Constructor: WebClient(opts)**

  - `opt` &lt;Object&gt;
    - `appId` &lt;string&gt; application id (required)
    - `appKey` &lt;string&gt;  appliction secret key (required)
    - `host` &lt;string&gt; Authefy API url. api

  ```typescript
  import { ServerClient } from &lt;package&gt;
  const authefyServerClient = new ServerClient({ 
    appId: 'app123', appKey: 'shh' 
  });
  ```

- #### **Getter: user**

  - **Method: create(input)**
    - `input` &lt;Object&gt;
      -  `username` &lt;string&gt; (required)
      - `password` &lt;string&gt; (required)
      - `externalId` &lt;string&gt; user reference under application
      - `groups` &lt;string[]&gt; groups id in array
      - `details` &lt;Object&gt; user additional information
      
    - Returns:&lt;Promise&gt; Fufills with &lt;[User](https://github.com/iammeosjin/http-server/blob/master/README.md#object-user)&gt; upon success. 
    
      ```typescript
      await authefyServerClient.user.create({ 
        username: 'john', password: 'doe' 
      })
      // [Object] User 
      ```
  - **Method: update(id, input)**
    - `id` &lt;string&gt; user id to update
    - `input` &lt;Object&gt;
      - `password` &lt;string&gt;
      - `isVerified` &lt;boolean&gt;
      - `groups` &lt;string[]&gt;
      - `details` &lt;Object&gt; user reference under application
      
    - Returns:&lt;Promise&gt; Fufills with `boolean` upon success. 
    
      ```typescript
      await authefyServerClient.user.update(
        'user123', 
        { 
          details: { name: 'johndoe' }
        }
      )
      // true
      ```
  - **Method: delete(id)**
    - `id` &lt;string&gt; user id to delete
    - Returns:&lt;Promise&gt; Fufills with `boolean` upon success. 
    
      ```typescript
      await authefyServerClient.user.delete('user123')
      // true
      ```

- #### **Getter: token**

  - **Method: authenticate(input)**

    - `input` &lt;Object&gt;

      -  `oneOf` &lt;Object&gt;  (required)
          -  `grantType` &lt;'bitclout'&gt; 
              -  `token` &lt;string&gt;
              -  `publicKey` &lt;string&gt;
          -  `grantType` &lt;'password'&gt; 
              -  `username` &lt;string&gt;
              -  `password` &lt;string&gt;
          -  `grantType` &lt;'refreshToken'&gt; 
              -  `refreshToken` &lt;string&gt;

    - Returns: &lt;Promise&gt; Fufills with `{ accessToken: string; refreshToken?: string; expiresIn: number; }` upon success. 

      ```typescript
      await authefyWebClient.token.authenticate({ 
        grantType: 'bitclout', 
        token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', 
        publicKey: 'pubKey123' 
      })
      await authefyWebClient.token.authenticate({ 
        grantType: 'password', 
        username: 'john', 
        password: 'doe' 
      })
      await authefyWebClient.token.authenticate({ 
        grantType: 'refreshToken', 
        refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g'
      })
      // { accessToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g', expiresIn: 60000 }
      ```
  - **Method: revoke(input)**

    - `input` &lt;Object&gt;

      -  `refreshToken` &lt;string&gt;  (required)

    - Returns: &lt;Promise&gt; Fufills with `boolean` upon success. 

      ```typescript
      await authefyWebClient.token.revoke({ 
        refreshToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g'
      })
      // true
      ```
  - **Method: authorizeBearer(authorization)**

    - `authorization` &lt;string&gt authorization token starts with `Bearer`;

    - Returns: &lt;Promise&gt; Fufills with `{ id: string; externalId?: string; iat: number; exp: number; sub: string }` upon success. 

      ```typescript
      await authefyWebClient.token.authorizeBearer('Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjEyNTYxNDMsImV4cCI6MTYyMTI1NjIwM30.uc8aXYsWsHZsF-62vKgIEqq8jw_K2bkhIgxB6FadUG-C_Lcl5F-66rRotSWm4_lsaStQ1pJjeRAUMvDh3ikz4g')
      // { id: '', externalId: '', iat: 1621401772134, exp: 1621401772134,  sub: '' }
      ```
- #### **Getter: event**

  - **Method: listen(options)**

    - `options` &lt;Object&gt;
      -  `startFromLastEventCursor` &lt;string | false | null&gt; 
      -  `type` &lt;'UserCreated' | 'UserUpdated' | 'UserDeleted'&gt; 
      -  `reconnect` &lt;boolean&gt; 
    - Returns: &lt;Promise&gt; Fufills with &lt;EventEmitter&gt; upon success. 

    - `emitter.on('data', callback)` 
    - `emitter.on('UserCreated' | 'UserUpdated' | 'UserDeleted', callback)` 

      ```typescript
      const emitter = await authefyWebClient.event.listen({ 
        startFromLastEventCursor: false,
        type: 'UserCreated'
        reconnect: false,
      })
      emitter.on('data', event => /* process event */) 
      // or
      emitter.on('UserCreated', event => /* process event */)
      emitter.on('UserUpdated', event => /* process event */)
      emitter.on('UserDeleted', event => /* process event */)
      ```
  - **Method: fetch(params)**

    - `params` &lt;Object&gt;
      - `filter` &lt;Object&gt;
        - `type`: &lt;'UserCreated' | 'UserUpdated' | 'UserDeleted'&gt;
      - `sort` &lt;ASC | DESC&gt;
      - `size` &lt;number&gt;
      - `after` &lt;string&gt;
      - `before` &lt;string&gt;

    - Returns: &lt;Promise&gt; Fufills with `{ edges: { UserEvent, cursor: string }[], endCursor?: string, totalCount: number }` upon success. 

      ```typescript
      await authefyWebClient.token.fetch({})
      ```

### Object: `User`

- `id` &lt;string&gt;
- `externalId` &lt;string&gt;
- `username` &lt;string&gt;
- `password` &lt;string&gt;
- `groups` &lt;string[]&gt;
- `details` &lt;Object&gt;
- `isEmailVerified` &lt;boolean&gt;
- `isVerified` &lt;boolean&gt;

### Object: `UserEvent`

- `id` &lt;string&gt;
- `user` &lt;string&gt;
- `externalId` &lt;string&gt;
- `application` &lt;string&gt;
- `dateTimeCreated` &lt;Date&gt;
- `cursor` &lt;string&gt;
- `type` &lt;'UserCreated' | 'UserUpdated' | 'UserDeleted'&gt;
- `body` &lt;Object&gt;
  