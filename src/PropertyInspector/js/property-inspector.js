var websocket = null,
	uuid = null,
	inInfo = null,
	actionInfo = {},
	settingsModel = {
		Total: 0,
		Character: 0,
		IncrementApiURL: '',
		DecrementApiURL: '',
		CharacterString: '',
		TotalString: ''
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
		settingsModel.CharacterString = actionInfo.payload.settings.settingsModel.CharacterString;
		settingsModel.TotalString = actionInfo.payload.settings.settingsModel.TotalString;
	}

	document.getElementById('txtTotalValue').value = settingsModel.Total;
	document.getElementById('txtCharacterValue').value = settingsModel.Character;
	document.getElementById('txtIncrementApiURLValue').value = settingsModel.IncrementApiURL;
	document.getElementById('txtDecrementApiURLValue').value = settingsModel.DecrementApiURL;
	document.getElementById('txtCharacterStringValue').value = settingsModel.CharacterString;
	document.getElementById('txtTotalStringValue').value = settingsModel.TotalString;

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

				if (jsonObj.payload.settings.settingsModel.CharacterString) {
					settingsModel.CharacterString = jsonObj.payload.settings.settingsModel.CharacterString;
					document.getElementById('txtCharacterStringValue').value = settingsModel.CharacterString;
				}

				if (jsonObj.payload.settings.settingsModel.TotalString) {
					settingsModel.TotalString = jsonObj.payload.settings.settingsModel.TotalString;
					document.getElementById('txtTotalStringValue').value = settingsModel.TotalString;
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

