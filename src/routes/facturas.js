const express = require('express');
const router = express.Router();
const pool = require('../database');
const path = require('path');
const fs = require('fs');
// const handlebars = require('handlebars');
// const puppeteer = require('puppeteer');

// Helpers 
const { isAuthenticated } = require('../helpers/auth');

// Add Factura
router.post('/addFactura', async(req, res) => {
    console.log(req.body);

    if( !req.body.telefono || !req.body.correo || !req.body.final || !req.body.Id_Form || !req.body.precioInicial){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }

    const factura = {
        concepto1: req.body.concepto1.toUpperCase() || '',
        concepto2: req.body.concepto2.toUpperCase() || '',
        precios: req.body.precios,
        telefono: req.body.telefono,
        correo: req.body.correo,
        final: req.body.final,
        Id_Form: req.body.Id_Form,
        status: 'E',
        precioInicial: req.body.precioInicial
    }


    const billdb = await pool.query(`INSERT INTO facturas (concepto1, concepto2, precios, telefono, correo, final, Id_Form, status, inicial) VALUES ('${req.body.concepto1}', '${req.body.concepto2}', '${req.body.precios}', '${req.body.telefono}', '${req.body.correo}', '${req.body.final}', '${req.body.Id_Form}', '${factura.status}', '${factura.precioInicial}')`).catch(e => {
        console.log(e);
        manejoErrores(400,'Error al Insertar la factura', res );
        return false;
    })

    if(billdb){
        const id = billdb.insertId;
        res.json(id);
    }
})

// Get facturas
router.get('/allFacturas', async(req, res) => {
    const facturadb = await pool.query('SELECT * FROM facturas_servicios_view').catch(e => {
        manejoErrores(400, 'Error al buscar las facturas', res);
        return false;
    })

    if(facturadb)
        res.json(facturadb);
})

// Get facturas Validated
router.get('/allFacturasValidated', async(req, res) => {
    const facturadb = await pool.query("SELECT * FROM facturas WHERE status = 'V' ").catch(e => {
        manejoErrores(400, 'Error al buscar las facturas', res);
        return false;
    })

    if(factura)
        res.json(facturadb);
})

// Get 1 Factura
router.get('/Factura/:id', async(req, res) => {
    const id = req.params.id;

    const facturadb = await pool.query(`SELECT * FROM facturas_servicios_view WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar la factura', res);
        return false;
    })

    if(factura.length)
        res.json(facturadb);
    else 
        manejoErrores(400, 'No existe la factura', res);
})

// Get factura file
router.get('/FacturaFile/:id', async(req, res) => {
    const id = req.params.id;

    const facturasel = await pool.query(`SELECT * FROM facturas_servicios_view WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar la factura', res);
        return false;
    })
    if(facturasel.length == 0)
        manejoErrores(400, 'No existe la factura', res);
    else{
        let date = new Date(facturasel[0].fecha);
        let month = date.getMonth()+1
        const concepto1 = facturasel[0].concepto1;
        const concepto2 = facturasel[0].concepto2;
        const precios = facturasel[0].precios;

        const body={
            fecha: date.getFullYear() + '-' + month +  '-' + date.getUTCDate(),
            facturar_a: facturasel[0].facturar_a,
            razonSocial: facturasel[0].razonSocial,
            nombre_tramitador: facturasel[0].nombre_tramitador,
            telefono_tramitador: facturasel[0].telefono, 
            email_tramitador: facturasel[0].correo,
            numero: facturasel[0].id,
            norma: facturasel[0].nombre_Norma,
            servicio: facturasel[0].Servicio,
            nombre_producto: facturasel[0].nombre_producto,
            marca_producto: facturasel[0].marca_producto,
            modelo_producto: facturasel[0].modelo_producto,
            input_precio : facturasel[0].inicial,
            input_final : facturasel[0].final,
            concepto1: concepto1,
            concepto2,
            precios
        }

        if(body.servicio == 'C')
            body.servicio = 'Constancia'
        else
            body.servicio = 'Dictamen'
        console.log('factura: ',facturasel ,'body', body);

        console.log('Se dio el pre', res.locals.html);
        let file = await createPDF(body, res.locals.html);
    
        console.log('EEEE ',file);
        res.sendFile(file);
    }
})

// Validate Factura
router.put('/ValidarFactura/:id', async(req, res) => {
    const id = req.params.id;
    console.log('llegue');

    const facturasel = await pool.query(`SELECT * FROM facturas WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar la factura', res);
        return false;
    })

    if(facturasel.length == 0)
        manejoErrores(400, 'La factura no existe', res);
    else{
        console.log(facturasel[0]);
        const factudaDb = await pool.query(`UPDATE facturas SET status = 'V' WHERE Id_Form = ${id}`).catch(e => {
            manejoErrores(400, 'Error al actualizar la factura', res);
            return false;
        })

        if(factudaDb)
            res.json('ok');
    }
})

// update factura
router.put('/putFactura/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.body, id)
    

    if( !req.body.telefono || !req.body.correo || !req.body.final || !req.body.Id_Form || !req.body.precioInicial){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }

    const factura = {
        concepto1: req.body.concepto1.toUpperCase() || '',
        concepto2: req.body.concepto2.toUpperCase() || '',
        precios: req.body.precios,
        telefono: req.body.telefono,
        correo: req.body.correo,
        final: req.body.final,
        Id_Form: req.body.Id_Form,
        status: req.body.status,
        precioInicial: req.body.precioInicial
    }

    const selFactura= await pool.query(`SELECT * FROM facturas WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar la factura', res);
    })

    if(selFactura.length == 0)
        manejoErrores(400, 'La factura no existe', res);
    else if(selFactura.length > 0){

        const updateFactura = await pool.query(`UPDATE facturas SET concepto1 = '${factura.concepto1}', concepto2 = '${factura.concepto2}', precios = '${factura.precios}', telefono = '${factura.telefono}', correo = '${factura.correo}', final = '${factura.final}', status = '${factura.status}', inicial = '${factura.precioInicial}' WHERE Id_Form = ${id} `).catch(e => {
            console.log(e);
            manejoErrores(400,'Error al Insertar la factura', res );
            return false;
        })

        if(updateFactura){
            res.json(parseInt(id));
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

//     let file_temp = path.join(directorio,'factura.pdf');

//     var templateHtml = fs.readFileSync(path.join(directorio, 'factura.html'), 'utf8');
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