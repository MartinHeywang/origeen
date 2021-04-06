function createVariable(variableName: string) {
    return "${"+variableName+"}";
}

function findVariable(variableName: string, text: string) {
    const index = text.indexOf(createVariable(variableName))
    return index
}

export function replaceVariable(variableName: string, value: string, text: string) {
    const editedText = text.replace(createVariable(variableName), value)
    return editedText
}