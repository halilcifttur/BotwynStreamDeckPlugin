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
		TotalPrefix: '',
		IsTotalActive: false
	};
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
	uuid = inUUID;
	actionInfo = JSON.parse(inActionInfo);
	inInfo = JSON.parse(inInfo);
	websocket = new WebSocket('ws://localhost:' + inPort);

	if (actionInfo.payload.settings.settingsModel) {
		settingsModel.Character = actionInfo.payload.settings.settingsModel.Character;
		settingsModel.CharacterPrefix = actionInfo.payload.settings.settingsModel.CharacterPrefix;
		settingsModel.IsTotalActive = actionInfo.payload.settings.settingsModel.IsTotalActive;
		if (settingsModel.IsTotalActive) {
			settingsModel.Total = actionInfo.payload.settings.settingsModel.Total;
			settingsModel.TotalPrefix = actionInfo.payload.settings.settingsModel.TotalPrefix;
		}
		settingsModel.IncrementApiURL = actionInfo.payload.settings.settingsModel.IncrementApiURL;
		settingsModel.DecrementApiURL = actionInfo.payload.settings.settingsModel.DecrementApiURL;

	}

	document.getElementById('txtCharacterValue').value = settingsModel.Character;
	document.getElementById('txtCharacterPrefixValue').value = settingsModel.CharacterPrefix;
	document.getElementById('isTotalActive').checked = settingsModel.IsTotalActive;
	if (document.getElementById('isTotalActive').checked) {
		document.getElementById('txtTotalValue').value = settingsModel.Total;
		document.getElementById('txtTotalPrefixValue').value = settingsModel.TotalPrefix;
	}
	document.getElementById('txtIncrementApiURLValue').value = settingsModel.IncrementApiURL;
	document.getElementById('txtDecrementApiURLValue').value = settingsModel.DecrementApiURL;

	websocket.onopen = function () {
		var json = { event: inRegisterEvent, uuid: inUUID };
		websocket.send(JSON.stringify(json));

	};

	websocket.onmessage = function (evt) {
		var jsonObj = JSON.parse(evt.data);
		var sdEvent = jsonObj['event'];
		switch (sdEvent) {
			case "didReceiveSettings":
				if (jsonObj.payload.settings.settingsModel.Character) {
					settingsModel.Character = jsonObj.payload.settings.settingsModel.Character;
					document.getElementById('txtCharacterValue').value = settingsModel.Character;
				}

				if (jsonObj.payload.settings.settingsModel.CharacterPrefix) {
					settingsModel.CharacterPrefix = jsonObj.payload.settings.settingsModel.CharacterPrefix;
					document.getElementById('txtCharacterPrefixValue').value = settingsModel.CharacterPrefix;
				}

				if (jsonObj.payload.settings.settingsModel.IsTotalActive) {
					settingsModel.IsTotalActive = jsonObj.payload.settings.settingsModel.IsTotalActive;
					document.getElementById('isTotalActive').checked = settingsModel.IsTotalActive;
				}

				if (document.getElementById('isTotalActive').checked) {
					if (jsonObj.payload.settings.settingsModel.Total) {
						settingsModel.Total = jsonObj.payload.settings.settingsModel.Total;
						document.getElementById('txtTotalValue').value = settingsModel.Total;
					}

					if (jsonObj.payload.settings.settingsModel.TotalPrefix) {
						settingsModel.TotalPrefix = jsonObj.payload.settings.settingsModel.TotalPrefix;
						document.getElementById('txtTotalPrefixValue').value = settingsModel.TotalPrefix;
					}
				}


				if (jsonObj.payload.settings.settingsModel.IncrementApiURL) {
					settingsModel.IncrementApiURL = jsonObj.payload.settings.settingsModel.IncrementApiURL;
					document.getElementById('txtIncrementApiURLValue').value = settingsModel.IncrementApiURL;
				}

				if (jsonObj.payload.settings.settingsModel.DecrementApiURL) {
					settingsModel.DecrementApiURL = jsonObj.payload.settings.settingsModel.DecrementApiURL;
					document.getElementById('txtDecrementApiURLValue').value = settingsModel.DecrementApiURL;
				}
				break;
			default:
				break;
		}
	};
}

function toggleCheckbox() {
	var lfckv = document.getElementById("isTotalActive").checked;
	if (lfckv) {
		document.getElementById("secondCounter").style.display = "block";
	} else {
		document.getElementById("secondCounter").style.display = "none";
	}
}

document.getElementById("isTotalActive").onclick = toggleCheckbox;

const setSettings = (value, param) => {
	if (websocket) {
		settingsModel[param] = value;
		var a = document.getElementById("isTotalActive").checked;
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

