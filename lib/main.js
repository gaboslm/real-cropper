//@ts-check
import { convertToBase64 } from "./utils"
import { validImageTypes } from './mimetypes'

export class Cropper {

	/**
	 * @param {HTMLElement} ParentElement
	 * @param {HTMLElement} ResetElement
	 * @param {HTMLElement} CropElement
	 * @param {HTMLImageElement} PreviewElement
	 * @param {HTMLInputElement} InputElement
	 * @param {{
	 * 	container: string
	 * 	crop: string
	 * 	reset: string
	 * 	preview: string
	 * 	mimeType: string
	 * 	onInvalidType: () => void
	 * }} Options
	 */
	ParentElement;
	ResetElement;
	CropElement;
	PreviewElement;
	InputElement;
	Options;

	/**
	 * @param {{
	 * 	container: string
	 * 	crop?: string
	 * 	reset?: string
	 * 	preview?: string
	 * 	mimeType?: string
	 * 	onInvalidType?: () => void
	 * }} Options
	 */
	constructor(Options){
		this.Options = {
			container: Options?.container ?? '#real-cropper',
			crop: Options?.crop ?? '#real-crop',
			reset: Options?.reset ?? '#real-reset',
			preview: Options?.preview ?? '#real-preview',
			mimeType: Options?.mimeType ?? 'image/*',
			onInvalidType: Options?.onInvalidType ?? null,
		}

		this.ParentElement = document.querySelector(this.Options.container);
		if(!this.ParentElement) return;
		console.log(this.ParentElement);

		this.ParentElement.addEventListener('click', () => this.openFileBrowser());

		const reset = document.querySelector(this.Options.reset);
		if(reset){
			this.ResetElement = reset;
			this.ResetElement.addEventListener('click', (e) => this.reset(e));
		}

		const crop = document.querySelector(this.Options.crop);
		if(crop){
			this.CropElement = crop;
			this.CropElement.addEventListener('click', (e) => this.initCrop(e));
		}

		const preview = document.querySelector(this.Options.preview);
		if(preview) this.PreviewElement = preview;

		const input = document.createElement('input');
		input.type = 'file';
		input.style.display = 'none';
		input.addEventListener('change', (e) => this.changeImage(e));
		this.ParentElement.appendChild(input)
		this.InputElement = input

		if(this.Options.mimeType){
			this.InputElement.accept = this.Options.mimeType;
		}
	}

	openFileBrowser(){
		this.InputElement?.click();
	}

	/**	
	 * 
	 * @param {any} event 
	 */
	async changeImage(event){
		try {
			const file = event?.target?.files?.[0];
			if(!file) return;
			this.File = file;

			const valid = this.validateType(file);
			if(!valid) return;

			const base64 = await convertToBase64(file);
			this.setImage(base64);

		} catch (error) {
			console.error(error);
		}
	}

	validateType(file){
		const ext = `.${file.name.split('.').pop()}`;
		const verifyPoint = mime => mime.charAt(0) === '.' ? mime : `.${mime}`
		const mimes = this.Options.mimeType.split('/')?.pop()?.split(',')?.map(verifyPoint);

		const allImageType = mimes?.includes('*');
		const passedImageMimeType = mimes?.includes(ext);
		const validImageMimeType = validImageTypes.includes(ext);

		const condition = validImageMimeType && (passedImageMimeType || allImageType);

		if(!condition && typeof this.Options.onInvalidType === 'function') this.Options.onInvalidType();

		return condition;
	}


	/**
	 * 
	 * @param {Event|PointerEvent} event 
	 */
	reset(event){
		if(this.InputElement instanceof HTMLInputElement) this.InputElement.value = '';
		this.setImage(null);
		event.stopPropagation();
	}

	/**
	 * 
	 * @param {Event|PointerEvent} event 
	 */
	initCrop(event){
		event.stopPropagation();
		if(this.InputElement instanceof HTMLInputElement && !this.InputElement.files?.[0]) return;

		console.log('init cropper');

	}

	/**
	 * 
	 * @param {String|null} value 
	 * @return {false|void}
	 */
	setImage(value){
		if(!this.PreviewElement) return;
		if(!(this.PreviewElement instanceof HTMLImageElement)) return;

		if(value === null){
			this.PreviewElement.src = '';
			this.PreviewElement.style.display = 'none';
			if(this.InputElement instanceof HTMLInputElement) this.InputElement.files = null;
		}else{
			this.PreviewElement.src = value;
			this.PreviewElement.style.display = 'block';
		}

	}
	
}
