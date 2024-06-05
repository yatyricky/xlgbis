let me = {
    hp: 1000,
    mp: 100,
    atk: 200,
}

let monsters = [
]

setInterval(() => {
    if (Math.random() < 0.3 && monsters.length === 0) {
        monsters.push({hp: 300, atk: 50})
        console.log("Encountered Mob");
    }

    for (const e of monsters) {
        e.hp -= me.atk
        console.log(`You did ${me.atk} damage to Mob`);
        me.hp -= e.atk
        console.log(`Mob did ${e.atk} damage to you`);
    }

    for (let i = monsters.length - 1; i >= 0; i--) {
        let e = monsters[i]
        if (e.hp <= 0) {
            console.log(`You killed mob`)
            monsters.splice(i, 1)
        }
    }
}, 1000);