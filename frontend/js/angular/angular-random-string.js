// originally insprired by https://github.com/klughammer/node-randomstring

angular.module('angularRandomString', []).factory(
	'randomString',
	['$window',
		function randomStringFactory(w){

			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			var Math = w.Math;

			return function randomString(length) {
				length = length || 10;
			var string = '', rnd;
				while (length > 0) {
					rnd = Math.floor(Math.random() * chars.length);
					string += chars.charAt(rnd);
					length--;
				}
				return string;
			};
		}
	]
);
