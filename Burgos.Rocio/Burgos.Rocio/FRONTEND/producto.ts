namespace Entidades{
    export class Producto{
         codigo:number;
         marca: string;
         precio : number;

         public constructor(codigo:number, marca:string,precio:number){
            this.codigo=codigo;
            this.marca= marca;
            this.precio= precio;
        }

        public ToString():string{
            return ('"codigo":'+this.codigo+',"marca":"'+this.marca+'","precio":"' + this.precio+'",');
            //return "codigo:"+ this.codigo+",nombre:"+this.nombre+" precio:"+this.precio;
        }

    }
}