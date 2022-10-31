import { Cropper } from "./lib/main";

const cropper = new Cropper({
	container: '#real-cropper',
	crop: '.edit',
	reset: '.delete',
	preview: '.preview',
	mimeType: '.png,.jpg,.jpeg',
	onInvalidType: () => alert('the selected image type is invalid')
});