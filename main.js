import { Cropper } from "./lib/main";

const cropper = new Cropper({
	crop: '.edit',
	reset: '.delete',
	preview: '.preview',
	mimeType: 'image/png',
	onInvalidType: () => alert('the selected image type is invalid')
})

cropper.render('#real-cropper')