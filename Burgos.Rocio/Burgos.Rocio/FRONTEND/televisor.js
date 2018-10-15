/// <reference path="producto.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entidades;
(function (Entidades) {
    var Televisor = /** @class */ (function (_super) {
        __extends(Televisor, _super);
        function Televisor(codigo, marca, precio, tipo, pais, foto) {
            var _this = _super.call(this, codigo, marca, precio) || this;
            _this.tipo = tipo;
            _this.paisOrigen = pais;
            _this.pathFoto = foto;
            return _this;
        }
        Televisor.prototype.televisorToJson = function () {
            var producto = _super.prototype.ToString.call(this);
            return JSON.parse('{' + producto + '"tipo":"' + this.tipo + '","pais":"' + this.paisOrigen + '","pathFoto":"' + this.pathFoto + '"}');
        };
        return Televisor;
    }(Entidades.Producto));
    Entidades.Televisor = Televisor;
})(Entidades || (Entidades = {}));
