function Persoon(voornaam, achternaam){
	var self = this;
	self.voornaam = voornaam;
	self.achternaam = achternaam;
}

function TestViewModel() {
    // Data
    var self = this;
	self.mensen = ko.observableArray([ new Persoon("Jurjen", "Pieters"), new Persoon("Marta", "Gula")]);
};

ko.applyBindings( new TestViewModel());