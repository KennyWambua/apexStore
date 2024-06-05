document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('orderForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const emailError = document.getElementById('emailError');

        fetch('/submit_order', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/orderPlaced';
            } else {
                if (data.errors.email) {
                    emailError.textContent = data.errors.email[0];
                } else {
                    emailError.textContent = '';
                }
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

console.clear();

if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById('cartContainer');

let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: $' + (ob.price) / 100);
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    // Add Remove button
    let removeButton = document.createElement('button');
    removeButton.id = 'removeButton';
    removeButton.textContent = 'Remove';
    removeButton.onclick = function () {
        removeItemFromCart(itemIndex);
    };
    boxDiv.appendChild(removeButton);
    

    buttonLink.appendChild(buttonText);
    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);

    return cartContainer;
}

let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
let h2Text = document.createTextNode('Total Amount');
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
    let totalh4 = document.createElement('h4');
    let totalh4Text = document.createTextNode('Amount: $ ' + (amount) / 100);
    totalh4Text.id = 'toth4';
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    totalDiv.appendChild(buttonDiv);
    console.log(totalh4);
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement('a');
buttonLink.href = 'javascript:void(0);';  // Prevent default navigation
buttonTag.appendChild(buttonLink);

buttonText = document.createTextNode('Place Order');
buttonTag.appendChild(buttonText);

buttonTag.onclick = function () {
    // Hide the cart container and show the order form
    document.getElementById('cartMainContainer').style.display = 'none';
    document.getElementById('orderFormContainer').style.display = 'block';
}

// BACKEND CALL
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status == 200) {
            contentTitle = JSON.parse(this.responseText);

            let counter = Number(document.cookie.split(',')[1].split('=')[1]);
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter);

            let item = document.cookie.split(',')[0].split('=')[1].split(" ");
            console.log(counter);
            console.log(item);

            let i;
            let totalAmount = 0;
            for (i = 0; i < counter; i++) {
                let itemCounter = 1;
                for (let j = i + 1; j < counter; j++) {
                    if (Number(item[j]) == Number(item[i])) {
                        itemCounter += 1;
                    }
                }
                totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
                dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
                i += (itemCounter - 1);
            }
            amountUpdate(totalAmount);
        } else {
            console.log('call failed!');
        }
    }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();