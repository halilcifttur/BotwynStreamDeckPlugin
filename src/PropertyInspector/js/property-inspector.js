var websocket = null,
	uuid = null,
	inInfo = null,
	actionInfo = {},
	settingsModel = {
		Total: 0,
		Character: 0,
		IncrementApiURL: '',
		DecrementApiURL: '',
		CharacterPrefix: '',
		TotalPrefix: ''
	};
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
	uuid = inUUID;
	actionInfo = JSON.parse(inActionInfo);
	inInfo = JSON.parse(inInfo);
	websocket = new WebSocket('ws://localhost:' + inPort);

	if (actionInfo.payload.settings.settingsModel) {
		settingsModel.Total = actionInfo.payload.settings.settingsModel.Total;
		settingsModel.Character = actionInfo.payload.settings.settingsModel.Character;
		settingsModel.IncrementApiURL = actionInfo.payload.settings.settingsModel.IncrementApiURL;
		settingsModel.DecrementApiURL = actionInfo.payload.settings.settingsModel.DecrementApiURL;
		settingsModel.CharacterPrefix = actionInfo.payload.settings.settingsModel.CharacterPrefix;
		settingsModel.TotalPrefix = actionInfo.payload.settings.settingsModel.TotalPrefix;
	}

	document.getElementById('txtTotalValue').value = settingsModel.Total;
	document.getElementById('txtCharacterValue').value = settingsModel.Character;
	document.getElementById('txtIncrementApiURLValue').value = settingsModel.IncrementApiURL;
	document.getElementById('txtDecrementApiURLValue').value = settingsModel.DecrementApiURL;
	document.getElementById('txtCharacterPrefixValue').value = settingsModel.CharacterPrefix;
	document.getElementById('txtTotalPrefixValue').value = settingsModel.TotalPrefix;

	websocket.onopen = function () {
		var json = { event: inRegisterEvent, uuid: inUUID };
		websocket.send(JSON.stringify(json));

	};

	websocket.onmessage = function (evt) {
		var jsonObj = JSON.parse(evt.data);
		var sdEvent = jsonObj['event'];
		switch (sdEvent) {
			case "didReceiveSettings":
				if (jsonObj.payload.settings.settingsModel.Total) {
					settingsModel.Total = jsonObj.payload.settings.settingsModel.Total;
					document.getElementById('txtTotalValue').value = settingsModel.Total;
				}

				if (jsonObj.payload.settings.settingsModel.Character) {
					settingsModel.Character = jsonObj.payload.settings.settingsModel.Character;
					document.getElementById('txtCharacterValue').value = settingsModel.Character;
				}

				if (jsonObj.payload.settings.settingsModel.IncrementApiURL) {
					settingsModel.IncrementApiURL = jsonObj.payload.settings.settingsModel.IncrementApiURL;
					document.getElementById('txtIncrementApiURLValue').value = settingsModel.IncrementApiURL;
				}

				if (jsonObj.payload.settings.settingsModel.DecrementApiURL) {
					settingsModel.DecrementApiURL = jsonObj.payload.settings.settingsModel.DecrementApiURL;
					document.getElementById('txtDecrementApiURLValue').value = settingsModel.DecrementApiURL;
				}

				if (jsonObj.payload.settings.settingsModel.CharacterPrefix) {
					settingsModel.CharacterPrefix = jsonObj.payload.settings.settingsModel.CharacterPrefix;
					document.getElementById('txtCharacterPrefixValue').value = settingsModel.CharacterPrefix;
				}

				if (jsonObj.payload.settings.settingsModel.TotalPrefix) {
					settingsModel.TotalPrefix = jsonObj.payload.settings.settingsModel.TotalPrefix;
					document.getElementById('txtTotalPrefixValue').value = settingsModel.TotalPrefix;
				}
				break;
			default:
				break;
		}
	};
}

const setSettings = (value, param) => {
	if (websocket) {
		settingsModel[param] = value;
		var json = {
			"event": "setSettings",
			"context": uuid,
			"payload": {
				"settingsModel": settingsModel
			}
		};
		websocket.send(JSON.stringify(json));
	}
};

