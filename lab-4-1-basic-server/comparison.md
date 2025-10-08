# HTTP vs Express Server 

So, we made two servers: one “vanilla” Node HTTP style and one with Express. Here’s the lowdown.

## 1. How They Work

- **HTTP Server**: You’re doing everything manually – parsing URLs, checking methods, setting headers.  
- **Express Server**: Framework does the heavy lifting – routing, JSON, middleware. Less boilerplate, more chill.

## 2. Routing

- **HTTP**: `if/else` everywhere. Messy if you add more routes.  
- **Express**: `app.get('/route')` – clean, readable, super simple to add more.

## 3. Endpoints

| Endpoint | HTTP | Express |
|----------|------|---------|
| `/` | Welcome + endpoints | Same, but easier |
| `/students` | List all students | Same |
| `/students/:id` | Find student | Same |
| `/students/major/:major` | Filter by major | Same |
| `/stats` | ❌ Nope | ✅ Shows total + per major |

## 4. Error Handling

- **HTTP**: 404 handled manually inside big callback.  
- **Express**: Fancy 404 middleware. Cleaner vibes.

## 5. Code Vibes

- **HTTP**: Boilerplate city. You see all the plumbing.  
- **Express**: Short, clean, readable. Easier to grow without going insane.

## TL;DR

- Wanna learn Node basics? Stick with HTTP.  
- Wanna actually build something fast and not cry? Go Express. 
