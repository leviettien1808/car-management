const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const carApi = 'http://localhost:3000/cars';

const getCars = function (callback) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    fetch(carApi, options)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

const createCar = function (data) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    fetch(carApi, options);
}

function handleDelete(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    fetch(carApi + '/' + id, options);
}

function updateCar(id, data) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    fetch(carApi + '/' + id, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

const app = (() => {
    const root = $('#root');
    const input = $('#input');
    const submit = $('#submit');

    return {
        add(car) {
            const formData = {
                name: car,
            }
            createCar(formData);
        },
        delete(id) {
            handleDelete(id);
        },
        edit(id, car) {
            const formData = {
                name: car,
            }
            updateCar(id, formData);
        },
        render(cars) {
            const html = cars ? cars.map(car => `
                <li>
                    ${car.name}
                    <span class="delete" data-id="${car.id}">&times;</span>
                    <span class="edit" data-id="${car.id}" data-name="${car.name}">Edit</span>
                </li>
            `)
                .join('') : '';
            root.innerHTML = html;
        },
        handleDelete(e) {
            const deleteBtn = e.target.closest('.delete');
            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                this.delete(id);
            }
            const editBtn = e.target.closest('.edit');
            if (editBtn) {
                const id = editBtn.dataset.id;
                const name = editBtn.dataset.name;
                input.value = name;
                submit.innerHTML = 'Save';
                submit.onclick = function () {
                    var name = input.value;
                    var formData = {
                        name
                    }
                    updateCar(id, formData);
                }
            }
        },
        init() {
            // Handle DOM events
            submit.onclick = () => {
                const car = input.value;
                this.add(car);

                input.value = null;
                input.focus();
            }
            root.onclick = this.handleDelete.bind(this);
            getCars(this.render);
        }
    }
})();

app.init();