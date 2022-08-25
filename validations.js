import Joi from 'joi'


export const existeUsuario = (usuarios, id) => {
    return(usuarios.find(u => u.id === parseInt(id)));
}


export const validationUser = (usuarios, body) => {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    })

    const { error, value } = schema.validate(body)

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };

        return { status: true, data: usuario }
        // usuarios.push(usuario)

        // res.send(usuario)
    } else {
        const mensaje = error.details[0].message

        return{ status: false, data: mensaje }
        // res.status(400).send(mensaje)
    }
}