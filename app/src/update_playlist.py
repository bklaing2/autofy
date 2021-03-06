import os
from rq import Queue
from pymongo import MongoClient
from bson.objectid import ObjectId
import spotipy

from app.src.playlist import Playlist
from app.src.cache_handlers import MemoryCacheHandler
from app.src.worker import conn


q = Queue(connection=conn)


# Set up Mongo
mongo = MongoClient(os.environ.get('MONGO_URL'))
db = mongo.autofy
playlists_coll = db.playlists



def update_playlist(playlist_obj):
    print(playlist_obj['_id'])

    cache_handler = MemoryCacheHandler(token_info=playlist_obj['token'])
    auth_manager = spotipy.oauth2.SpotifyOAuth(cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        print('Error with token')

    spotify = spotipy.Spotify(auth_manager=auth_manager)

    playlist = Playlist(spotify, playlist_obj)
    if playlist.has_deleted():
        playlist.delete_all()
        playlists_coll.delete_one({'_id': ObjectId(playlist_obj['_id'])})
    else:
        playlist.update()
        playlists_coll.update_one({'_id': ObjectId(playlist_obj['_id'])}, {'$set': playlist.get_json()})