/// <reference path="producto.ts" />

namespace Entidades{
    export class Televisor extends Producto{
        tipo:string;
        paisOrigen:string;
        pathFoto:string;

        public constructor(codigo:number,marca:string, precio:number,tipo:string,pais:string,foto:string){
            super(codigo,marca,precio);
            this.tipo=tipo;
            this.paisOrigen=pais;
            this.pathFoto=foto;
        }

        public televisorToJson():any{
            
            let producto:string=super.ToString();
            
            return JSON.parse('{'+producto+'"tipo":"'+this.tipo+'","pais":"'+this.paisOrigen+'","pathFoto":"'+this.pathFoto+'"}');
        }

    }
}
