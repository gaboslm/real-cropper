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
	 * 	crop?: string
	 * 	reset?: string
	 * 	preview?: string
	 * 	mimeType?: string
	 * 	onInvalidType?: () => void
	 * }} Options
	 */
	ParentElement = document.createElement('div');
	ResetElement = document.createElement('div');
	CropElement = document.createElement('div');
	PreviewElement = document.createElement('img');
	InputElement = document.createElement('input');
	Options = {};

	/**
	 * @param {{
	 * 	crop?: string
	 * 	reset?: string
	 * 	preview?: string
	 * 	mimeType?: string
	 * 	onInvalidType?: () => void
	 * }} Options
	 */
	constructor(Options){
		this.Options = {
			crop: Options.crop ?? '#crop',
			reset: Options.reset ?? '#reset',
			preview: Options.preview ?? '#preview',
			mimeType: Options.mimeType ?? 'image/*',
			onInvalidType: Options.onInvalidType ?? null,
		}

		if(Options.reset) this.ResetElement = document.querySelector(Options.reset) ?? document.createElement('div');
		if(Options.crop) this.CropElement = document.querySelector(Options.crop) ?? document.createElement('div');
		if(Options.preview) this.PreviewElement = document.querySelector(Options.preview) ?? document.createElement('img');
		if(Options.mimeType) this.InputElement.accept = Options.mimeType;

		if(this.ResetElement) this.ResetElement.addEventListener('click', (e) => this.reset(e));
		if(this.CropElement) this.CropElement.addEventListener('click',  (e) => this.initCrop(e));
	}

	/**
	 * 
	 * @param {any} ref
	 */
	render(ref){
		if(!ref) return;

		this.InputElement.type = 'file';
		this.InputElement.addEventListener('change', (e) => this.changeImage(e));

		const parent = document.querySelector(ref);
		if(!parent) return;

		this.ParentElement = parent;
		this.ParentElement.addEventListener('click', () => this.openFileBrowser());
	}

	openFileBrowser(){
		this.InputElement.click();
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

		const allImageType = mimes.includes('*');
		const passedImageMimeType = mimes.includes(ext);
		const validImageMimeType = validImageTypes.includes(ext);

		const condition = validImageMimeType && (passedImageMimeType || allImageType);

		const callable = typeof this.Options.onInvalidType === 'function';
		
		if(!condition && callable) this.Options.onInvalidType();

		return condition;
	}


	/**
	 * 
	 * @param {Event|PointerEvent} event 
	 */
	reset(event){
		this.InputElement.value = '';
		this.setImage(null);
		event.stopPropagation();
	}

	/**
	 * 
	 * @param {Event|PointerEvent} event 
	 */
	initCrop(event){
		event.stopPropagation();

		if(!this.InputElement.files?.[0]) return;

		console.log('init cropper');

	}

	/**
	 * 
	 * @param {String|null} value 
	 * @return {false|void}
	 */
	setImage(value){
		if(!this.PreviewElement) return;
	
		if( value === null){
			this.PreviewElement.src = '';
			this.PreviewElement.style.display = 'none';
			this.InputElement.files = null;
		}else{
			this.PreviewElement.src = value;
			this.PreviewElement.style.display = 'block';
		}

	}
	
}
