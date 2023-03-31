FROM alpine
# EXPOSE 9000
COPY docker-entrypoint.sh /
COPY dist /dist
RUN apk add --no-cache nodejs npm
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD []

