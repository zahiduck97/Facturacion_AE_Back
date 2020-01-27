const express = require('express');
const router = express.Router();
const pool = require('../database');
const path = require('path');
const fs = require('fs');
// const handlebars = require('handlebars');
// const puppeteer = require('puppeteer');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Add Service
router.post('/addService', async(req, res) => {

    if(!req.body.Id_Form || !req.body.Id_Usuario){
        manejoErrores(400, 'Faltan datos', res)
    }

    const Service = {
        Id_Form_Dicta: 0,
        Id_Form : req.body.Id_Form,
        Id_Dictamen: req.body.Id_Dictamen || '',  
        Id_Usuario: req.body.Id_Usuario,
        Id_Empleado: '',
        status:  'E',   
        fecha:  0,
        solicitud:  0
    }
    var ServiceInsert;

    if(Service.Id_Dictamen == ''){
        ServiceInsert = await pool.query(`INSERT INTO servicios (Id_Form, Id_Usuario, status) VALUES ('${Service.Id_Form}', '${Service.Id_Usuario}', '${Service.status}')`).catch(e => {
            console.log(e);
            manejoErrores(400, 'Error al insertar', res)
        })
    } else {
        ServiceInsert = await pool.query(`INSERT INTO servicios (Id_Form, Id_Dictamen, Id_Usuario, status) VALUES ('${Service.Id_Form}', '${Service.Id_Dictamen}', '${Service.Id_Usuario}', '${Service.status}')`).catch(e => {
            console.log(e);
            manejoErrores(400, 'Error al insertar', res)
        })
    }

    if(ServiceInsert){
        ServiceInsert.Id_Form_Dicta = ServiceInsert.insertId;
        res.json(ServiceInsert);
    }
        

});

// Obatiining final service
router.get('/FinalService/:id', async(req, res ) => {
    const id = req.params.id;

    const formSel = await pool.query(`SELECT * FROM final_service_view WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar en la vista', res);
        return false;
    })

    if(formSel.length == 0)
        manejoErrores(400, 'El formulario no existe', res);
    else if(formSel.length){
        if(formSel[0].Id_Dictamen == '' || formSel[0].Id_Dictamen == null){
            console.log('Entro');
            let date = new Date(formSel[0].fecha);
            let month = date.getMonth()+1;
            const  data = {
                empleado: formSel[0].nombre_Empleado,
                solicitud: formSel[0].solicitud,
                reviso: formSel[0].iniciales,
                fecha: date.getFullYear() + '-' + month +  '-' + date.getUTCDate(),
                razon: formSel[0].razonSocial,
                contrato: formSel[0].numeroContrato,
                rfc: formSel[0].rfc,
                calle: formSel[0].calle,
                exterior: formSel[0].numeroExterior,
                interior: formSel[0].numeroInterior,
                colonia: formSel[0].colonia,
                municipio: formSel[0].municipio,
                estado: formSel[0].estado,
                cp: formSel[0].codigo_postal,
                representante: formSel[0].representante,
                tramitador: formSel[0].nombre_tramitador,
                telefono: formSel[0].telefono_tramitador,
                email: formSel[0].email_tramitador,
                Servicio : formSel[0].Servicio,
                norma : formSel[0].nombre_Norma,
                anexos: formSel[0].anexos,
                anexos_dictamen: '',
                nombre_producto : formSel[0].nombre_producto,
                marca_producto : formSel[0].marca_producto,
                pais_producto : formSel[0].pais_producto,
                modelo_producto : formSel[0].modelo_producto,
                presentacion_producto : formSel[0].presentacion_producto,
                contenido_producto : formSel[0].contenido_producto,
                pedimento: '',
                factura: '',
                lote: '',
                calle_verificacion: '',
                fraccion: '',
                exterior_v: '',
                interior_v: '',
                colonia_verficacion: '',
                cp_verificacion: '',
                municipio_verificacion: '',
                estado_verificacion: '',
                telefono_verificacion: '',
                contacto: '',
                fecha_verificacion: '',
                fiscal: ''
            }
    
            let file = await createPDF(data, res.locals.html);
    
            console.log('EEE');
            res.sendFile(file); 
        } else {
            console.log('Do babs');
            console.log(formSel[0]);
            const dictamenSel = await pool.query(`SELECT * FROM dictamenes WHERE Id_Dictamen = ${formSel[0].Id_Dictamen}`).catch(e => {
                console.log(e);
                manejoErrores(400, 'Error al buscar el dictamen', res);
                return false;
            })
            let date = new Date(formSel[0].fecha);
            let month = date.getMonth()+1;

            const  data = {
                empleado: formSel[0].nombre_Empleado,
                solicitud: formSel[0].solicitud,
                reviso: formSel[0].iniciales,
                fecha: date.getFullYear() + '-' + month +  '-' + date.getUTCDate(),
                razon: formSel[0].razonSocial,
                contrato: formSel[0].numeroContrato,
                rfc: formSel[0].rfc,
                calle: formSel[0].calle,
                exterior: formSel[0].numeroExterior,
                interior: formSel[0].numeroInterior,
                colonia: formSel[0].colonia,
                municipio: formSel[0].municipio,
                estado: formSel[0].estado,
                cp: formSel[0].codigo_postal,
                representante: formSel[0].representante,
                tramitador: formSel[0].nombre_tramitador,
                telefono: formSel[0].telefono_tramitador,
                email: formSel[0].email_tramitador,
                Servicio : formSel[0].Servicio,
                norma : formSel[0].nombre_Norma,
                anexos: formSel[0].anexos,
                anexos_dictamen: dictamenSel[0].anexos_dictamen || '',
                nombre_producto : formSel[0].nombre_producto,
                marca_producto : formSel[0].marca_producto,
                pais_producto : formSel[0].pais_producto,
                modelo_producto : formSel[0].modelo_producto,
                presentacion_producto : formSel[0].presentacion_producto,
                contenido_producto : formSel[0].contenido_producto,
                pedimento: dictamenSel[0].pedimento || '',
                factura: dictamenSel[0].factura || '',
                lote: dictamenSel[0].lote || '',
                calle_verificacion: dictamenSel[0].calle_verificacion || '',
                fraccion: dictamenSel[0].fraccion || '',
                exterior_v: dictamenSel[0].numeroExterior || '',
                interior_v: dictamenSel[0].numeroInterior || '',
                colonia_verificacion: dictamenSel[0].colonia_verficacion || '',
                cp_verificacion: dictamenSel[0].codigo_postal_verificacion || '',
                municipio_verificacion: dictamenSel[0].municipio_verificacion || '',
                estado_verificacion: dictamenSel[0].estado_verificacion || '',
                telefono_verificacion: dictamenSel[0].telefono_verificacion || '',
                contacto: dictamenSel[0].nombre_verificacion || '',
                fecha_verificacion: dictamenSel[0].fecha_verificacion || '',
                fiscal: dictamenSel[0].domicilio || ''
            }
    
            let file = await createPDF(data, res.locals.html);
    
            console.log('EEE');
            res.sendFile(file);
        }

        // console.log({ form: formSel[0], dict: dictamenSel[0] });
    }
})

// Get form Empresas
router.get('/formEmpresas', async(req, res) => {
    const formdb = await pool.query('SELECT * FROM form_empresas_view').catch(e => {
        manejoErrores(400, 'Error al buscar en la vista', res);
        return false;
    })

    if(formdb)
        res.json(formdb);
})

// Get 1 form Empresa
router.get('/formEmpresa/:id', async(req, res) => {
    const id = req.params.id;

    const formdb = await pool.query(`SELECT * FROM form_empresas_view WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar en la vista', res);
        return false;
    })

    if(formdb)
        res.json(formdb[0]);
})

// Put Service
router.put('/service/:id', async(req, res) => {
    console.log(req.body);

    const id = req.params.id;
    
    if(!req.body.Id_Form || !req.body.Id_Usuario){
        manejoErrores(400, 'Faltan datos', res)
    }
    var ServiceInsert;

    const serviceSel = await pool.query(`SELECT * FROM servicios WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el servicio', res);
        return false
    })

    if(serviceSel.length == 0)
        manejoErrores(400, 'No existe el servicio', res);
    else {  
        let temp  
        if(req.body.Id_Dictamen == "")
            temp = null;
        else
            temp = req.body.Id_Dictamen;
        ServiceInsert = await pool.query(`UPDATE servicios SET Id_Dictamen = ${temp} WHERE Id_Form = ${id};`).catch(e => {
            manejoErrores(400, 'Error al actualizar', res)
            return false;
        })

        if(ServiceInsert){
            res.json(parseInt(id));
        }

    }
})


// Change Status to Verified
router.put('/serviceVerified/:id', async(req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const id_empleado = req.user.Id_Empleado;
    console.log('emoleado: ',req.user, id_empleado)
    
    if(!req.body.Id_Form || !req.body.norma || !req.body.factura){
        manejoErrores(400, 'Faltan datos', res)
        return false
    }

    const servicio = {
        Id_Form : req.body.Id_Form,
        Id_Dictamen : req.body.Id_Dictamen || '',
        status: 'V',
        solicitud: '',
        norma: req.body.norma,
        Id_Factura: req.body.factura
    }

    
    const serviceSel = await pool.query(`SELECT * FROM servicios WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el servicio', res);
        return false
    })

    if(serviceSel.length == 0)
        manejoErrores(400, 'No existe el servicio', res);
    else {    
        var solicitud= '';
        if(servicio.Id_Dictamen == ''){
            console.log('entro');
            var d = new Date();
            solicitud = d.getFullYear().toString().substring(2,4)+'USC'+servicio.norma+ servicio.Id_Factura.toString().padStart(6,"0");

            console.log(solicitud);
            
            

            const ServiceInsert = await pool.query(`UPDATE servicios SET status = '${servicio.status}', solicitud = '${solicitud}', Id_Empleado = '${id_empleado}' WHERE Id_Form = ${id}`).catch(e => {
                manejoErrores(400, 'Error al actualizar', res)
                return false;
            })

            if(ServiceInsert)
                res.json('ok');
        } else {
            var d = new Date();
            solicitud = d.getFullYear().toString().substring(2,4)+'USD'+servicio.norma+ servicio.Id_Factura.toString().padStart(6,"0");
            const ServiceInsert = await pool.query(`UPDATE servicios SET status = 'V', solicitud = '${solicitud}', Id_Empleado = '${id_empleado}'  WHERE Id_Form = ${id}`).catch(e => {
                manejoErrores(400, 'Error al actualizar', res)
                return false;
            })
            if(ServiceInsert)
                res.json('ok');
        }

    }
})


// Functions
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    });
}

// async function createPDF(data, directorio){

//     let file_temp = path.join(directorio,'final.pdf');

//     var templateHtml = fs.readFileSync(path.join(directorio, 'constancia.html'), 'utf8');
//     var template = handlebars.compile(templateHtml);
//     var html = template(data);

//     fs.writeFileSync(file_temp,'',function (err) {
//         if (err) throw err;
//         console.log('File is created successfully.');
//     }); 

//     var pdfPath = file_temp;

//     var options = {
//         width: '792px',
//         headerTemplate: "<p></p>",
//         footerTemplate: "<p></p>",
//         displayHeaderFooter: false,
//         printBackground: true,
//         path: pdfPath
//     }

//     const browser = await puppeteer.launch({
//         'args' : [
//           '--no-sandbox',
//           '--disable-setuid-sandbox'
//         ]
//       });
//     var page = await browser.newPage();
    
//     await page.goto(`data:text/html;charset=UTF-8,${html}`, {
//         waitUntil: 'networkidle0'
//     });
//     await page.pdf(options);
//     await browser.close();				
//     console.log('listo');
//     return file_temp;
// }


module.exports = router;