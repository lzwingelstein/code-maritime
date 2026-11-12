# Code maritime

Apprendre le code du permis bateau côtier par petites leçons, à la manière de Duolingo.
Premier cours : **le balisage (région A)** — marques latérales, cardinales, danger isolé, eaux saines, marque spéciale, et leurs feux de nuit.

- Règles du jeu : [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)
- Instructions pour Claude Code : [CLAUDE.md](CLAUDE.md)

## Lancer en local

```sh
cd web
npm ci --ignore-scripts && npx nuxt prepare
npm run dev
```

Tests et lint :

```sh
cd web && npm run lint && npm run typecheck && npm test -- --run
```

Image Docker (site statique servi par nginx) :

```sh
docker build -t code-maritime-web web && docker run -p 3000:80 code-maritime-web
```

## Déploiement

La CI publie `ghcr.io/lzwingelstein/code-maritime/web:latest` à chaque merge sur `main`.
Dans Dokploy : créer une application « Docker Compose » à partir de `deploy/docker-compose.prod.yml`, lui donner un domaine (port 80), puis Deploy.
