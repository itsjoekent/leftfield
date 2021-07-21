build:
		docker build . -t svc.blueprint.image

local:
		docker run --name svc.blueprint \
			--rm -t -i \
			-p 6004:6004 \
			-v $(CURDIR)/../../packages:/usr/code/packages \
			-v $(CURDIR)/../../environment:/usr/code/environment \
			-v $(CURDIR)/src:/usr/code/services/blueprint/src \
			svc.blueprint.image \
			npm run start:local
