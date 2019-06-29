const Campground = require('./models/campground'),
    Comment = require("./models/comment"),
    mongoose = require('mongoose');

const data = [
    {
        name: "Flaming Gorge Reservoir",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "Duis ullamco nisi ex laborum in cillum qui enim est. Irure quis consectetur ea ipsum consectetur cupidatat consectetur aliqua excepteur duis fugiat nisi nostrud tempor. Proident eu nulla quis nostrud ut. Aliqua ea ut veniam fugiat incididunt est ipsum in mollit anim veniam fugiat est adipisicing. Adipisicing nulla ad qui excepteur."
    },
    {
        name: "Zapata Falls",
        image: "https://images.unsplash.com/photo-1473713984581-b8918cc3652e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "Duis proident duis fugiat adipisicing labore voluptate elit irure sunt veniam culpa tempor. Est excepteur nisi pariatur id. Laboris officia aliqua enim proident. Tempor excepteur magna cupidatat aute aute sint do cillum pariatur ad. Lorem qui laboris veniam magna. Incididunt ut laborum tempor dolor do laborum."
    },
    {
        name: "Marzola",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
        description: "Eiusmod occaecat duis deserunt exercitation aute consectetur labore irure dolor dolor duis. Aute aute officia incididunt excepteur incididunt excepteur deserunt. Occaecat nulla reprehenderit sint non nostrud est eiusmod cupidatat. Reprehenderit ipsum labore proident magna ad."
    },
    {
        name: "Zion National Park",
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=753&q=80",
        description: "Esse quis ea enim proident deserunt commodo enim proident amet do Lorem. Do nulla dolore nulla elit consequat nostrud non. Cillum eu officia do velit amet tempor fugiat culpa nulla adipisicing do qui ea."
    },
    {
        name: "Altai Republic",
        image: "https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=747&q=80",
        description: "Consectetur do ea laboris excepteur esse pariatur magna aliqua cupidatat proident. Ipsum labore minim aliquip ad amet. Adipisicing incididunt amet qui pariatur dolore aliquip occaecat. Duis aute ad id laborum deserunt adipisicing nisi."
    },
    {
        name: "canoe camping",
        image: "https://images.unsplash.com/photo-1558550122-079d10d8dc29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=689&q=80",
        description: "Sint officia id labore nulla dolore reprehenderit laborum nulla elit laborum cupidatat est adipisicing. Nisi est fugiat in excepteur officia aute. Velit nisi occaecat ullamco reprehenderit excepteur ex cupidatat nostrud. Incididunt tempor nulla esse laboris non do quis sint in commodo tempor."
    },
    {
        name: "Deer Creek Reservoir",
        image: "https://images.unsplash.com/photo-1459378560864-f0b73495599c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "Culpa pariatur et excepteur ex adipisicing. Irure consequat cillum dolor quis deserunt voluptate consectetur. Ipsum minim exercitation excepteur nulla laborum amet culpa est consequat. Eiusmod consequat id magna incididunt ea et. Aliqua eu duis culpa tempor. Nulla enim ad exercitation magna laboris dolore ea consequat. Nostrud ex consectetur nostrud enim ullamco et eiusmod Lorem ad ut."
    },
    {
        name: "Banff, Canada",
        image: "https://images.unsplash.com/photo-1464054573978-f220a48c764c?ixlib=rb-1.2.1&auto=format&fit=crop&w=753&q=80",
        description: "Aute dolor eu excepteur elit non sint. Adipisicing elit occaecat cillum aute ad qui pariatur deserunt elit dolor tempor sit est veniam. Ut nulla sit proident adipisicing laboris amet exercitation. Reprehenderit pariatur irure aliqua duis veniam consequat amet eu tempor commodo proident."
    }
]

function seedDB() {
    Campground.remove({}, (err) => {
        // if (err) {
        //     console.log(err);
        // }
        // else {
        //     data.forEach((seed) => {
        //         Campground.create(seed, (err, campground) => {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 Comment.remove({}, (err) => {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                     else {
        //                         Comment.create(
        //                             {
        //                                 text: "This is an excellent place. I would love to be in a place where there are no internet and phone signals",
        //                                 author: "Gaurav Thantry"
        //                             }, (err, comment) => {
        //                                 if (err) {
        //                                     console.log(err);
        //                                 }
        //                                 else {
        //                                     campground.comments.push(comment);
        //                                     campground.save();
        //                                 }
        //                             });
        //                         }
        //                 })

        //             }
        //         });
        //     });
        // }
    });
}

module.exports = seedDB;