build:
		docker build . -t svc.renderer.image
		docker run --name svc.renderer-frontend \
				--rm -t \
				-v $(CURDIR)/../../packages:/usr/code/packages \
				-v $(CURDIR)/../../environment:/usr/code/environment \
				-v $(CURDIR)/dist:/usr/code/services/renderer/dist \
				svc.renderer.image \
				npm run build-all-frontends

local:
		docker run --name svc.renderer \
			--rm -t -i \
			-p 6003:6003 \
			-v $(CURDIR)/../../packages:/usr/code/packages \
			-v $(CURDIR)/../../environment:/usr/code/environment \
			-v $(CURDIR)/src:/usr/code/services/renderer/src \
			-v $(CURDIR)/frontends:/usr/code/services/renderer/frontends \
			-v $(CURDIR)/dist:/usr/code/services/renderer/dist \
			svc.renderer.image \
			npm run start:local
