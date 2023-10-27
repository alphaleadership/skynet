const fs = require('fs');
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function log(data) {
  const timestamp = new Date().getTime();
  const filename = `${timestamp}.txt`;

  // Écrivez les données dans le fichier avec le nom basé sur le timestamp
  fs.appendFile(filename, data + '\n', (err) => {
    if (err) {
      console.error(`Erreur lors de l'écriture dans le fichier ${filename}: ${err}`);
    } else {
      console.log(`Données enregistrées dans ${filename}: ${data}`);
    }
  });
}
async function main (){
  let i=0
  while(i<=100){
    await delay(10)
    const message = "11";
    log(message);
    i++
    
  }
}

// Utilisation de la fonction

main()