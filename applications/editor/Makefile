build:
	docker build . -t app.editor.image

local:
		docker run --name app.editor \
		--rm -t \
		-p 5000:5000 \
		-v $(CURDIR)/../../packages:/usr/code/packages \
		-v $(CURDIR)/../../environment:/usr/code/environment \
		-v $(CURDIR)/src:/usr/code/applications/editor/src \
		app.editor.image \
		npm run start:development
