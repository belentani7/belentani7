# Container image for the published site.
#
# There is no build stage on purpose: the deliverable is the static artifact in
# `docs/` (Vercel runs with an empty install and build command). The image only
# has to serve it with the same headers, compression and cache policy.
#
#   docker build -t belentani7-site .
#   docker run --rm -p 3000:3000 belentani7-site
FROM nginx:1.29-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
# Overwrites the distribution's default server: ours is the only one listening.
COPY docs/ /usr/share/nginx/html/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
