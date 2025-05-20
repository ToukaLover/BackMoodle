FROM mongo:6.0

COPY mongo_init/restore.sh /restore.sh
COPY mongo_export /export

RUN chmod +x /restore.sh

ENTRYPOINT [ "/restore.sh" ]
