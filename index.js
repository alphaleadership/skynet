const fs = require('fs');
const path = require('path');
const readline = require('readline');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function nowStamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, text) {
  return new Promise(resolve => rl.question(text, answer => resolve(answer)));
}

function banner() {
  console.log('\n============================');
  console.log(' Skynet Script Hub');
  console.log('============================');
  console.log('Choisissez un script et lancez-le en quelques secondes.\n');
}

async function scriptJournal(rl) {
  const message = await question(rl, 'Message à enregistrer : ');
  const repetitions = Number(await question(rl, 'Nombre de lignes (ex: 5) : ')) || 1;
  const delayMs = Number(await question(rl, 'Délai entre chaque ligne en ms (ex: 100) : ')) || 50;
  const filename = path.join(process.cwd(), `journal_${nowStamp()}.txt`);

  for (let i = 0; i < repetitions; i += 1) {
    await delay(delayMs);
    fs.appendFileSync(filename, `${new Date().toISOString()} | ${message}\n`);
    console.log(`Ligne ${i + 1}/${repetitions} enregistrée.`);
  }

  console.log(`\n✅ Journal terminé : ${filename}\n`);
}

async function scriptCompteur(rl) {
  const limit = Number(await question(rl, 'Compter jusqu’à : ')) || 10;
  const delayMs = Number(await question(rl, 'Délai entre chaque nombre en ms : ')) || 100;
  console.log('--- Démarrage du compteur ---');
  for (let i = 1; i <= limit; i += 1) {
    await delay(delayMs);
    console.log(`→ ${i}`);
  }
  console.log('✅ Compteur terminé.\n');
}

async function scriptGenerator(rl) {
  const total = Number(await question(rl, 'Combien de fichiers créer ? ')) || 3;
  const prefix = await question(rl, 'Préfixe des fichiers (ex: note) : ');
  const safePrefix = prefix.trim() || 'note';
  for (let i = 1; i <= total; i += 1) {
    const filename = path.join(process.cwd(), `${safePrefix}_${i}.txt`);
    const content = `Fichier ${i}/${total} généré le ${new Date().toLocaleString()}.`;
    fs.writeFileSync(filename, content);
    console.log(`📄 Créé : ${filename}`);
  }
  console.log('✅ Génération terminée.\n');
}

async function scriptExplorer() {
  const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
  console.log('\n--- Contenu du dossier ---');
  entries.forEach(entry => {
    const icon = entry.isDirectory() ? '📂' : '📄';
    console.log(`${icon} ${entry.name}`);
  });
  console.log('--------------------------\n');
}

async function scriptZen(rl) {
  const cycles = Number(await question(rl, 'Nombre de cycles respiration (ex: 3) : ')) || 3;
  console.log('\nRespiration guidée :');
  for (let i = 1; i <= cycles; i += 1) {
    console.log(`Cycle ${i}/${cycles} → Inspire...`);
    await delay(1000);
    console.log('...Retiens...');
    await delay(1000);
    console.log('...Expire...');
    await delay(1000);
  }
  console.log('✅ Session terminée.\n');
}

const scripts = [
  {
    id: '1',
    name: 'Journal rapide',
    description: 'Enregistrer un message dans un fichier horodaté',
    run: scriptJournal
  },
  {
    id: '2',
    name: 'Compteur express',
    description: 'Compter avec un délai personnalisable',
    run: scriptCompteur
  },
  {
    id: '3',
    name: 'Générateur de fichiers',
    description: 'Créer plusieurs fichiers texte automatiquement',
    run: scriptGenerator
  },
  {
    id: '4',
    name: 'Explorateur local',
    description: 'Lister le contenu du dossier courant',
    run: scriptExplorer
  },
  {
    id: '5',
    name: 'Pause Zen',
    description: 'Mini routine de respiration',
    run: scriptZen
  }
];

async function main() {
  const rl = createInterface();

  banner();

  let shouldContinue = true;
  while (shouldContinue) {
    console.log('Scripts disponibles :');
    scripts.forEach(script => {
      console.log(`  ${script.id}. ${script.name} — ${script.description}`);
    });
    console.log('  0. Quitter');

    const choice = await question(rl, '\nVotre choix : ');
    const selected = scripts.find(script => script.id === choice.trim());

    if (choice.trim() === '0') {
      shouldContinue = false;
      console.log('\nÀ bientôt !');
      break;
    }

    if (!selected) {
      console.log('⛔ Choix invalide. Merci de réessayer.\n');
      continue;
    }

    console.log(`\n▶ Lancement : ${selected.name}\n`);
    await selected.run(rl);
  }

  rl.close();
}

main();
