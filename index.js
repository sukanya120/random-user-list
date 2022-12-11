let page=0;
const nationalities= ["All", "AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US"];
let nationality = "all";
//let gender = "all";
let isFetchAlowed = true;

$(document).ready(function (){
    fetchUsers();

    for (const nationality of nationalities) {
        const option = $('<option>', {
            value:nationality,
            text:nationality
        })
        $('#selNationalities').append(option);
    }
});

function fetchUsers(){
    fetchUserRow();
    const numRows = window.matchMedia("only screen and (max-width: 760px)").matches? 2:6
    for (let index = 0; index < numRows; index++) {
        setTimeout(function (){
            fetchUserRow();
        }, index*1000);
    }
}

function fetchUserRow(){
    page++;
    let filter = "";
    if(nationality !== "all"){
        filter += `&nat=${nationality}`;
    }
    // if(gender !== "all"){
    //     filter += `&gender=${gender}`;
    // }
    $.ajax({
        url: `https://randomuser.me/api?page=${page}&results=3&seed=cb1ce6f7d24090e6${filter}`,
        dataType: 'json',
        success: function(data) {
            renderUserRow(data.results);
        }
    });
}

function renderUserRow(users){
    const row = $('<div>', {
        class: 'row'
    });

    for (const user of users) {
        const cardHtml = 
        `<div class="col-xl-4 col-lg-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <img
                        src="${user.picture.thumbnail}"
                        alt=""
                        style="width: 45px; height: 45px"
                        class="rounded-circle"
                        />
                        <div class="ms-3">
                            <p class="fw-bold mb-1">${user.name.first} ${user.name.last}</p>
                            <p class="text-muted mb-0">@${user.login.username}</p>
                        </div>
                    </div>
                    <div class="collapse mt-3">
                        <div class="text-muted">${user.dob.age} year old ${user.gender} 
                        from ${user.location.city}, ${user.location.country}</div>
                        <div class="mt-3">
                            <small class="text-muted">Email Address</small>
                            <br/>
                            <small>${user.email}</small>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <small class="text-muted">Cell</small>
                                <br/>
                                <small>${user.cell}</small>
                            </div>
                            <div class="col">
                                <small class="text-muted">Phone</small>
                                <br/>
                                <small>${user.phone}</small>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <small class="text-muted">Address</small>
                                <br/>
                                <small>${user.location.street.name}, ${user.location.street.number}</small>
                                <br/>
                                <small>${user.location.postcode} ${user.location.city}</small>
                                <br/>
                                <small>${user.location.state}, ${user.location.country}</small>
                            </div>
                            <div class="col">
                                <small class="text-muted">Nationality</small>
                                <br/>
                                <small>${user.nat}</small>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>`;
        row.append(cardHtml);
    }

    $('#divUsers').append(row);
}

window.onscroll= function(e){
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight -10) {
        if(isFetchAlowed){
            fetchUserRow(); 
            isFetchAlowed = false; 
            setTimeout(function(){
                isFetchAlowed = true;
            }, 500);
        }
    }
}


$('#modalUser').on('focusOut', function(){
    $(this).modal('hide');
})

$(document).on("click", ".card-body" , function() {
    const isExpanded = $(this).children('.collapse').eq(0).hasClass('show');
    $('.collapse').collapse('hide');
    if(!isExpanded){
        $(this).children('.collapse').eq(0).collapse('show');
    }
});

$('#iFilter').on('click', function(){
    $('#ocFilter').offcanvas('show');
});

$('#btnFilter').on('click', function(){
    $('#divUsers').html("");
    //gender = $('#selGender').val().toLowerCase();
    nationality = $('#selNationalities').val().toLowerCase();
    page=0;
    fetchUsers();
    $('#ocFilter').offcanvas('hide');
});




