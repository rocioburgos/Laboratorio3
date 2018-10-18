/// <reference path="./producto.ts" />
/// <reference path="./televisor.ts" />
namespace PrimerParcial{
    export class Manejadora{

        public static AgregarTelevisor(){
          if(Manejadora.AdministrarValidaciones()){   
              
            var opcion :string= (<HTMLInputElement>document.getElementById("btn-agregar")).value;

            var codigo:number= parseInt((<HTMLInputElement>document.getElementById("codigo")).value);
            var marca:string= (<HTMLInputElement>document.getElementById("marca")).value;
            var precio:number= parseInt((<HTMLInputElement>document.getElementById("precio")).value);
            var tipo:string= (<HTMLInputElement>document.getElementById("tipo")).value;
            var pais:string= (<HTMLSelectElement>document.getElementById("pais")).value;
            let foto : any = (<HTMLInputElement> document.getElementById("foto"));

            //Manejadora.AdministrarValidaciones();
            
                alert("ok");
                
                var unTelevisor= new Entidades.Televisor(codigo,marca,precio,tipo,pais,foto.files[0].name);//(codigo,nombre,precio,talle,color,retJSON.ruta);
                let xhttp : XMLHttpRequest = new XMLHttpRequest();
                xhttp.open("POST", "BACKEND/administrar.php", true);
                xhttp.setRequestHeader("enctype", "multipart/form-data");
                PrimerParcial.Manejadora.AdministrarSpinner(true);
                let form : FormData = new FormData();
                form.append('foto', foto.files[0]);
                console.log(unTelevisor.televisorToJson());
                form.append('cadenaJson',JSON.stringify(unTelevisor.televisorToJson()));

                if(opcion=="Agregar"){
                    form.append('caso', "agregar");
                    xhttp.send(form);
        
                    xhttp.onreadystatechange = () => {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            alert(xhttp.responseText);
                            let retJSON = JSON.parse(xhttp.responseText);
                        
                            if(retJSON.TodoOK)
                            { 
                                PrimerParcial.Manejadora.LimpiarForm();
                                alert("operacion realizada");
                            }   
                    
                    }
                
                    } 
                    
                }else{
                    form.append('caso', "modificar");
            
                    xhttp.send(form);
            
                    xhttp.onreadystatechange = () => {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            alert(xhttp.responseText);
                            let retJSON = JSON.parse(xhttp.responseText);
                        
                            if(retJSON.TodoOK)
                            { 
                                alert("operacion realizada");
                                PrimerParcial.Manejadora.MostrarTelevisores();
                            }   
                    
                        }
                    }   
                }
                PrimerParcial.Manejadora.AdministrarSpinner(false);
            PrimerParcial.Manejadora.LimpiarForm();
        }else{
            alert("Hay errores.");
        }
            
        }
        

  

        public static MostrarTelevisores(){
            let xmlhttp : XMLHttpRequest = new XMLHttpRequest();
            let div= (<HTMLDivElement>document.getElementById("divTabla"));
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function() {
               
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                   
                    let response=JSON.parse(xmlhttp.responseText);
                    div.innerHTML="";
                    var tabla =`<table border='1'><tr>
                <td>Codigo</td>
                <td>Marca</td>
                <td>Precio</td>
                <td>Tipo</td>
                <td>Pais</td>
                <td>Foto</td></tr>`;
              
                    for(let i=0; i< response.length; i++){
                        
                        let tv= response[i];
                        
                       tabla+="<tr><td>"+tv.codigo +"</td><td>"+tv.marca+"</td><td>"+tv.precio+"</td><td>"+tv.tipo+"</td><td>"+tv.pais+"</td><td><img src='./BACKEND/fotos/"+ tv.pathFoto+"' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor("+JSON.stringify(tv)+")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor("+JSON.stringify(tv)+")'></td></tr>";
                    }
                    PrimerParcial.Manejadora.AdministrarSpinner(false);

                    div.innerHTML+=tabla+"</table>";

                }
            }
        }


        //     




        public static GuardarEnLocalStorage(){
            let xmlhttp : XMLHttpRequest = new XMLHttpRequest();
            let div= (<HTMLDivElement>document.getElementById("divTabla"));
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function() {
               
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    localStorage.setItem("televisores_local_storage",xmlhttp.responseText);
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
                    alert("Operacion realizada");
                }
            }
        }


        public static VerificarExistencia(){
            var codigo:number= parseInt((<HTMLInputElement>document.getElementById("codigo")).value);
            var localJson=  localStorage.getItem("televisores_local_storage");
            var existe=false;
            if(localJson!=null)
            { 
                let json:any= JSON.parse(localJson);

                for(let i=0; i< json.length;i++){
                    if(json[i].codigo==codigo){
                        alert("El televisor ya existe");
                        console.log("El televisor ya existe");
                      
                        existe=true;
                    }
                }

                if(!existe){
                    PrimerParcial.Manejadora.AgregarTelevisor();
                    localStorage.setItem("televisores_local_storage","");
                    PrimerParcial.Manejadora.GuardarEnLocalStorage();
                }
               
            }else{

               alert("El token esta vacio");
               console.log("El token esta vacio");
            }
            PrimerParcial.Manejadora.LimpiarForm();
        }

          
        public static EliminarTelevisor(eliminar:JSON){
            
            var tvEliminar: any= eliminar;
            if(confirm("Desea eliminar a "+tvEliminar.codigo+" "+tvEliminar.tipo)){
                PrimerParcial.Manejadora.AdministrarSpinner(true);
                   let xmlhttp : XMLHttpRequest = new XMLHttpRequest(); 
                   xmlhttp.open("POST", "./BACKEND/administrar.php", true);
                    xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
                    xmlhttp.send("caso=eliminar&cadenaJson="+JSON.stringify(eliminar));
                 
                   xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        let retJson=JSON.parse(xmlhttp.responseText);
                        if(retJson.TodoOK){
                            alert("eliminado");
                            PrimerParcial.Manejadora.AdministrarSpinner(false);
                            PrimerParcial.Manejadora.MostrarTelevisores();
                        }
                    }
                }
                
                   
            }else{
                alert("Accion cancelada");
            }
            
         
        }

         
        public static ModificarTelevisor(modificar:JSON){
            var tvModificar:any= modificar;
            (<HTMLInputElement>document.getElementById("codigo")).value=tvModificar.codigo;
            (<HTMLInputElement>document.getElementById("marca")).value= tvModificar.marca;
            ((<HTMLInputElement>document.getElementById("precio")).value)= tvModificar.precio;
            ((<HTMLInputElement>document.getElementById("tipo")).value)= tvModificar.tipo;
            ((<HTMLInputElement>document.getElementById("codigo")).readOnly)=true;
            (<HTMLSelectElement>document.getElementById("pais")).value= tvModificar.pais;
            (<HTMLImageElement>document.getElementById("imgFoto")).src="./BACKEND/fotos/"+tvModificar.pathFoto;
         //   ((<HTMLInputElement>document.getElementById("foto")).value)="./BACKEND/fotos/"+tvModificar.pathFoto;
            (<HTMLInputElement>document.getElementById("btn-agregar")).value="Modificar";
           
        }

        public static FiltrarPorPais(){

            var paisSelec= (<HTMLSelectElement>document.getElementById("pais")).value;
            let xmlhttp : XMLHttpRequest = new XMLHttpRequest();   
            let div= (<HTMLDivElement>document.getElementById("divTabla"));
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function() {
               
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                   
                    let response=JSON.parse(xmlhttp.responseText);
                    div.innerHTML="";
                    var tabla =`<table border='1'><tr>
                <td>Codigo</td>
                <td>Marca</td>
                <td>Precio</td>
                <td>Tipo</td>
                <td>Pais</td>
                <td>Foto</td></tr>`;
              
                    for(let i=0; i< response.length; i++){
                        
                        let tv= response[i];
                        if(tv.pais==paisSelec)
                        {  
                          tabla+="<tr><td>"+tv.codigo +"</td><td>"+tv.marca+"</td><td>"+tv.precio+"</td><td>"+tv.tipo+"</td><td>"+tv.pais+"</td><td><img src='./BACKEND/fotos/"+ tv.pathFoto+"' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor("+JSON.stringify(tv)+")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor("+JSON.stringify(tv)+")'></td></tr>";
                        }
                    }
                PrimerParcial.Manejadora.AdministrarSpinner(false);

                    div.innerHTML+=tabla+"</table>";

                }
            }
    
         /*   let xmlhttp : XMLHttpRequest = new XMLHttpRequest();   
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
            xmlhttp.send("caso=taer");
            
        //    Test.Manejadora.AdministrarSpinner(true);
            
            let div= (<HTMLDivElement>document.getElementById("divTabla"));
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
                    alert(xmlhttp.responseText);
                    let response=JSON.parse( xmlhttp.responseText);
                    alert(response);
                    div.innerHTML=""
                    var tabla =`<table border='1'><tr>
                    <td>Codigo</td>
                    <td>Marca</td>
                    <td>Precio</td>
                    <td>Tipo</td>
                    <td>Pais</td>
                    <td>Foto</td></tr>`;
                    for(let i=0; i< response.length; i++){
                        
                        let tv= response[i];
                        if(tv.pais==paisSelec)
                        {
                           tabla+="<tr><td>"+tv.codigo +"</td><td>"+tv.marca+"</td><td>"+tv.precio+"</td><td>"+tv.tipo+"</td><td>"+tv.pais+"</td><td><img src='./BACKEND/fotos/"+ tv.pathFoto+"' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor("+JSON.stringify(tv)+")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor("+JSON.stringify(tv)+")'></td></tr>";
                        }
                    }
              
                  
                  // Test.Manejadora.AdministrarSpinner(false);
                    div.innerHTML+=tabla+"</table>";
                }
            }*/
            
             
        }
 
        public static CargarPaises(){
            var paisSelec= (<HTMLSelectElement>document.getElementById("pais"));
  
        let xmlhttp : XMLHttpRequest = new XMLHttpRequest();  
        xmlhttp.open("POST", "./BACKEND/administrar.php", true);
        xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xmlhttp.send("caso=paises");
        PrimerParcial.Manejadora.AdministrarSpinner(true);
        xmlhttp.onreadystatechange = function() {
            paisSelec.innerHTML="";
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    let response:any=JSON.parse( xmlhttp.responseText);
                    for(let i=0;i<response.length;i++){
                        paisSelec.innerHTML+= "<option>"+response[i].descripcion+"</option>";
                
                    }
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
            }
        }
    }

    
        private static LimpiarForm() {
            (<HTMLInputElement>document.getElementById("codigo")).value="";
            (<HTMLInputElement>document.getElementById("marca")).value="";
            ((<HTMLInputElement>document.getElementById("precio")).value)="";
            ((<HTMLInputElement>document.getElementById("tipo")).value)="";
            ((<HTMLImageElement>document.getElementById("imgFoto")).src)="./BACKEND/fotos/tv_defecto.jpg";
            (<HTMLSelectElement>document.getElementById("pais")).value="Argentina";
        }
    
    
        private static AdministrarSpinner(mostrar:boolean){
            if(mostrar){
                (<HTMLDivElement>document.getElementById("divSpinner" )).style.display="block";
              //  (<HTMLImageElement>document.getElementById("imgSpinner")).src="./BACKEND/gif-load.gif";
            }else{
                (<HTMLDivElement>document.getElementById("divSpinner" )).style.display="none";
            }
        }

        //codigo - marca- precio-tipo - pais- foto
        public static AdministrarValidaciones(){
            var retorno=true;
            //codigo
           let codigo:number=parseInt((<HTMLInputElement>document.getElementById("codigo")).value);
            if(!this.ValidarCamposVacios("codigo") || !this.ValidarCodigo(codigo)){
                Manejadora.AdministrarSpanErrores("codigo",true);
                retorno=false;
            }else{
                Manejadora.AdministrarSpanErrores("codigo",false);
            }

            //marca
            if(!this.ValidarCamposVacios("marca")){
                Manejadora.AdministrarSpanErrores("marca",true);
                retorno=false;
            }else{
                Manejadora.AdministrarSpanErrores("marca",false);
            }

            //precio
            if(!this.ValidarCamposVacios("precio")){
                Manejadora.AdministrarSpanErrores("precio",true);
                retorno=false;
            }else{
                Manejadora.AdministrarSpanErrores("precio",false);
            }

            //foto
            if(!this.ValidarCamposVacios("foto")){
                Manejadora.AdministrarSpanErrores("foto",true);
                retorno=false;
            }else{
                Manejadora.AdministrarSpanErrores("foto",false);
            }
            //tipo
            var tipo:string= (<HTMLInputElement>document.getElementById("tipo")).value;
            var permitidos:string[]=["Tubo", "Plasma", "Led", "Smart", "4K", "8K"];
            if(!this.ValidarCamposVacios("tipo") || !this.ValidarTipo(tipo,permitidos)){
                Manejadora.AdministrarSpanErrores("tipo",true);
                retorno=false;
            }else{
                Manejadora.AdministrarSpanErrores("tipo",false);
            }
        
            return retorno;
        }

        /*ValidarCamposVacios(string): boolean. Recibe como parámetro el valor del atributo 
        id del campo a ser validado. Retorna true si no está vacío o false caso contrario. */
        public static ValidarCamposVacios(id:string):boolean{
            var valor:string= ((<HTMLInputElement>document.getElementById(id)).value);
            if(valor.length >0){
                return true;
            }else{
                return false;
            }
        }

        /*ValidarTipo(string, string[]): boolean. Recibe como parámetro el valor a ser validado 
        y los valores permitidos para los tipos (Tubo, Plasma, Led, Smart, 4K, 8K). Retorna true 
        si el valor pertenece a los tipos o false caso contrario. */
        public static ValidarTipo(valor:string,tiposPermiditos:string[]):boolean{
            for(let i=0;i<tiposPermiditos.length; i++){
                if(tiposPermiditos[i]== valor){
                    return true;
                }
            }

            return false;
        }

        /*ValidarCodigo(number): boolean. Recibe como parámetro el valor del código a ser validado y 
        retorna true si el mismo es mayor o igual a 523 y menor a 1000. False caso contrario. */
        public static ValidarCodigo(valor:number):boolean{
            if(valor>=523 && valor<1000){
                return true;
            }else{
                return false;
            }
        }

        private static AdministrarSpanErrores(id:string , mostrar:boolean){

            if(mostrar){
               
                (<HTMLSpanElement>(<HTMLSpanElement>document.getElementById(id)).nextElementSibling).style.display="block";
               
            }else{
                (<HTMLSpanElement>(<HTMLSpanElement>document.getElementById(id)).nextElementSibling).style.display="none";
            }
        }


        private static VerificarSpan():boolean {
            let boolRetorno = true;
            let todoSpan: NodeList = document.querySelectorAll("span");
    
            for(let i=0;i<todoSpan.length;i++)
            {
                if((<HTMLSpanElement>todoSpan[i]).style.display=="block")
                {
                    boolRetorno=false;
                    break;
                }
            }
    
            return boolRetorno;
        }
    }
}