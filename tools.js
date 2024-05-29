const buscarIndex = (statement, caracter) => {
    for (let i = 0; i < statement.length; i++) {
        if (statement[i] == caracter) {
            return i;
        }
    }
}

const utc_iso = (fecha) => {
    try {
        let date = {
            day: fecha.substring(0, 2),
            month: fecha.substring(3, 5),
            year: fecha.substring(6, 10)
        }

        let time = fecha.replace('UTC', 'Z')

        time = time.substring(buscarIndex(time, "T") + 1, time.length)
        let salida = `${date.month}/${date.day}/${date.year} ${time}`
        
        return salida

    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = { utc_iso }