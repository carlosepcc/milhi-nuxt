
// Helper to generate a slug from a string
export const slugify = (text: string) =>{
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export const currency =(n:number,currencyCode:'CUP'|'USD'| string = 'CUP') => n.toLocaleString('es-US',{currency: currencyCode, currencySign:'accounting',currencyDisplay:'symbol'})
export const cup = (n:number) => currency(n)
export const usd = (n:number) => currency(n,'USD')