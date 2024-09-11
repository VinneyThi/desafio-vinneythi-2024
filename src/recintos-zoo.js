class RecintosZoo {
    #recints = new Map([
        ['savana', { size: 10, label: 'Recinto 1', belongs: new Map() }],
        ['floresta', { size: 5, label: 'Recinto 2', belongs: new Map() }],
        ['savana_e_rio', { size: 7, label: 'Recinto 3', belongs: new Map(), isExtra: true }],
        ['rio', { size: 8, label: 'Recinto 4', belongs: new Map() }],
        ['savana_2', { size: 9, label: 'Recinto 5', belongs: new Map() }],
    ]);

    #animalInfo = new Map([
        ['LEAO', { size: 3, habitats: ['savana', 'savana_2','savana_e_rio'] }],
        ['LEOPARDO', { size: 2, habitats: ['savana', 'savana_2','savana_e_rio'] }],
        ['CROCODILO', { size: 3, habitats: ['rio'] }],
        ['MACACO', { size: 1, habitats: ['savana', 'savana_2', 'floresta', 'savana_e_rio'] }],
        ['GAZELA', { size: 2, habitats: ['savana', 'savana_2', 'savana_e_rio'] }],
        ['HIPOPOTAMO', { size: 4, habitats: ['savana', 'savana_2', 'rio', 'savana_e_rio'] }]
    ]);

    #carnivores = ['LEAO', 'LEOPARDO', 'CROCODILO'];

    constructor() {
        this.#populateRecints()
    }

    #populateRecints() {
        [
            { target: 'savana', animal: 'MACACO', qtd: 3 },
            { target: 'savana_e_rio', animal: 'GAZELA', qtd: 1 },
            { target: 'savana_2', animal: 'LEAO', qtd: 1 }
        ].forEach(init => {
            const animal = this.#animalInfo.get(init.animal)
            this.#recints.get(init.target).belongs.set(init.animal, init.qtd * animal.size)
        })
    }


    #monkeyRule(animal, quantidade) {

        const result = {
            recintosViaveis: []
        }

        const currentAnimal = this.#animalInfo.get(animal)
        
        currentAnimal.habitats.forEach(habitat => {
            const currentHabitat = this.#recints.get(habitat)

            const needSize = currentAnimal.size * quantidade

            let totalAnimals = currentHabitat.belongs.size === 0 || (currentHabitat.belongs.size === 1 && currentHabitat.belongs.has(animal)) ? 0 : 1;
                      
            for (const qtd of currentHabitat.belongs.values()) {
                totalAnimals += qtd
            }
            
            if ((totalAnimals + quantidade) <= 1 || (needSize + totalAnimals) > currentHabitat.size) {
                return
            }
 
            for (const key of currentHabitat.belongs.keys()) {
                if (this.#carnivores.includes(key)) {
                    return
                }
            }

            for (const key of currentHabitat.belongs.keys()) {
                if (this.#isHippo(key) && !currentHabitat.isExtra) {
                    return
                }
            }

            if (needSize + totalAnimals > currentHabitat.size) {
                return
            }

         
            result.recintosViaveis.push(`${currentHabitat.label} (espaço livre: ${currentHabitat.size - totalAnimals - needSize} total: ${currentHabitat.size})`)
        })
        if (result.recintosViaveis.length === 0) {            
            return {erro : 'Não há recinto viável'}
        }
        
        return result
    }

    #othersRule(animal, quantidade) {

        const result = {
            recintosViaveis: []
        }

        const currentAnimal = this.#animalInfo.get(animal)
        currentAnimal.habitats.forEach(habitat => {
            const currentHabitat = this.#recints.get(habitat)

            const needSize = currentAnimal.size * quantidade

            let totalAnimals = currentHabitat.belongs.size === 0 || (currentHabitat.belongs.size === 1 && currentHabitat.belongs.has(animal)) ? 0 : 1;

            for (const qtd of currentHabitat.belongs.values()) {
                totalAnimals += qtd
            }

            if ((needSize + totalAnimals) > currentHabitat.size) {
                return
            }

            for (const key of currentHabitat.belongs.keys()) {
                if (this.#carnivores.includes(key)) {
                    return
                }
            }

            for (const key of currentHabitat.belongs.keys()) {
                if (this.#isHippo(key) && !currentHabitat.isExtra) {
                    return
                }
            }

            if (needSize + totalAnimals > currentHabitat.size) {
                return
            }

            result.recintosViaveis.push(`${currentHabitat.label} (espaço livre: ${currentHabitat.size - totalAnimals - needSize} total: ${currentHabitat.size})`)
        })

        if (result.recintosViaveis.length === 0) {
            return {erro : 'Não há recinto viável'}
        }

        return result
    }

    #hippoRule(animal, quantidade) {

        const result = {
            recintosViaveis: []
        }

        const currentAnimal = this.#animalInfo.get(animal)
        currentAnimal.habitats.forEach(habitat => {
            const currentHabitat = this.#recints.get(habitat)

            const needSize = currentAnimal.size * quantidade

            let totalAnimals = currentHabitat.belongs.size === 0 || (currentHabitat.belongs.size === 1 && currentHabitat.belongs.has(animal)) ? 0 : 1;

            for (const qtd of currentHabitat.belongs.values()) {
                totalAnimals += qtd
            }

            if ((totalAnimals + quantidade) > 1 || (needSize + totalAnimals) > currentHabitat.size) {
                return
            }

            for (const key of currentHabitat.belongs.keys()) {
                if (this.#carnivores.includes(key)) {
                    return
                }
            }

            for (const key of currentHabitat.belongs.keys()) {
                if (!this.#isHippo(key) && !currentHabitat.isExtra) {
                    return
                }
            }

            if (needSize + totalAnimals > currentHabitat.size) {
                return
            }

            result.recintosViaveis.push(`${currentHabitat.label} (espaço livre: ${currentHabitat.size - totalAnimals - needSize} total: ${currentHabitat.size})`)
        })

        if (result.recintosViaveis.length === 0) {
            return {erro : 'Não há recinto viável'}
        }

        return result
    }

    #carnivoresRule(animal, quantidade) {
        const result = {
            recintosViaveis: []
        }

        const currentAnimal = this.#animalInfo.get(animal)
        currentAnimal.habitats.forEach(habitat => {
            const currentHabitat = this.#recints.get(habitat)

            const needSize = currentAnimal.size * quantidade

            let totalAnimals = currentHabitat.belongs.size === 0 || (currentHabitat.belongs.size === 1 && currentHabitat.belongs.has(animal)) ? 0 : 1;

            for (const qtd of currentHabitat.belongs.values()) {
                totalAnimals += qtd
            }            

            if (currentHabitat.belongs.size >1 || (currentHabitat.belongs.size === 1 && !currentHabitat.belongs.has(animal)) || needSize + totalAnimals > currentHabitat.size) {
                return
            }
            result.recintosViaveis.push(`${currentHabitat.label} (espaço livre: ${currentHabitat.size - totalAnimals - needSize} total: ${currentHabitat.size})`)
        })

        if (result.recintosViaveis.length === 0) {
            return {erro : 'Não há recinto viável'}
        }

        return result
    }

    #isMonkey(animal) {
        return animal === 'MACACO'
    }

    #isHippo(animal) {
        return animal === 'HIPOPOTAMO'
    }

    #isCarnivores(animal) {
        return this.#carnivores.includes(animal)
    }

    analisaRecintos(animal, quantidade) {
        if (!this.#animalInfo.has(animal)) {
            return {
                erro: "Animal inválido"
            };
        }

        if (Number(quantidade) <= 0 || Number(quantidade) === NaN) {
            return {
                erro: "Quantidade inválida"
            };
        }

        if (this.#isCarnivores(animal)) {
            return this.#carnivoresRule(animal, quantidade);
        }

        if (this.#isMonkey(animal)) {
            return this.#monkeyRule(animal, quantidade);
        }

        if (this.#isHippo(animal)) {
            return this.#hippoRule(animal, quantidade);
        }

        return this.#othersRule(animal, quantidade);
    }
}

export { RecintosZoo as RecintosZoo };
