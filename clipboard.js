function clipboard(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()

    try {
        document.execCommand('copy')
    } catch (err) {
        return
    }

    document.body.removeChild(textarea)
    return true
}

export default clipboard