from pymongo import *
from bson.objectid import ObjectId
from bson.json_util import dumps
import glob

client = MongoClient('localhost', 27017)
db = client['bibliothek']

def pretty_print(json_data):
    print(dumps(json_data, indent=4))


def load_file(filename):
    str = open(filename, 'r').read()
    data = eval(str)

    for url in data.keys():
        entry = create_db_entry(url, data[url])

        if(book_exists(entry)):
            pass
        else:
            db.books.save(entry)

def book_exists(book):
    if(db.books.find_one({ "$or" : [
        {"ISBN":book["ISBN"]},
        {"bookTitle":book["bookTitle"]}
        ]})):
        return True
    return False

def create_db_entry(url, data):
    result = data

    book_id = str(ObjectId())
    book_title = data['bookTitle']

    result["_id"] = book_id
    authors = data["authors"]
    publisher_name = data["publisher"]
    result['authors'] = []
    result['publisher'] = []

    for author_name in authors:
        author = db.authors.find_one({"name":author_name})

        if author:
            # we don't want to embed the whole info because if we were to do that 
            # we would embed also list of books of that author
            # which changes, and we would get dirty data
            result['authors'].append(author['_id'])
            # add_book_to_author(author, book_id, book_title)
        else:
            new_author = add_author(author_name)#, book_id, book_title)
            result['authors'].append(new_author['_id'])

    publisher = db.publishers.find_one({"name":publisher_name})

    if publisher:
        #we don't want to embed the whole info, same reason
        result['publisher'] = publisher['_id']
        #add_book_to_publisher(publisher, book_id, book_title)
    else:
        new_publisher = add_publisher(publisher_name)#, book_id, book_title)
        result['publisher'] = new_publisher['_id']

    return result

def add_author(author_name):#, book_id, book_title):
    #embedded_book = {"_id":book_id, "bookTitle":book_title}
    book_author = {"_id":str(ObjectId()), "name":author_name} # ;, "books":[embedded_book]}
    db.authors.save(book_author)
    return book_author


def add_publisher(publisher_name):#, book_id, book_title):
    #embedded_book = {"_id":book_id, "bookTitle":book_title}
    book_publisher = {"_id":str(ObjectId()), "name":publisher_name}#, "books":[embedded_book]}
    db.publishers.save(book_publisher)
    return book_publisher

def get_files():
    all_files = glob.glob("books/*.*")
    all_files = [file.replace("\\","/") for file in all_files ]
    all_files = [file.split('/')[-1] for file in all_files ]
    return(all_files)

for file in get_files():
    print("loading " + file)
    load_file("books\\" + file)