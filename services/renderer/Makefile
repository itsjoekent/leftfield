build:
	docker build . -t svc.renderer.image

local:
		docker run --name svc.renderer \
		--rm -t \
		-p 6003:6003 \
		-v $(CURDIR)/../../packages:/usr/code/packages \
		-v $(CURDIR)/../../environment:/usr/code/environment \
		-v $(CURDIR)/src:/usr/code/services/renderer/src \
		-v $(CURDIR)/frontends:/usr/code/services/renderer/frontends \
		svc.renderer.image \
		npm run start:development
