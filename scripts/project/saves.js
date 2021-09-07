export class saves{

	constructor(){
	
	}

	async  getStorageData(key, defaultKey){

		let datas = await rn.storage.getItem(key);
		// If key is empty then make it as 0
		if (datas === null)
		{
			await rn.storage.setItem(key, defaultKey);
			datas = defaultKey;
		}

		return await Promise.resolve(datas);
	}

	async  setStorageData(key, val){
		await rn.storage.setItem(key, val);
	}

}

