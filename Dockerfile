FROM node:22-alpine3.19 as build
WORKDIR /app
COPY . ./
RUN npm install && npm run minify

FROM node:22-alpine3.19
ARG BUILD_ENV=production
COPY --from=build /app/public2 /app/public
COPY --from=build /app/inject2 /app/inject
COPY --from=build /app/src /app/src
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
COPY --from=build /app/.env /app/.env
COPY --from=build /app/.production.env /app/.production.env
COPY --from=build /app/LICENSE /app/LICENSE
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
