import os
import sys
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline

output_dir = 'output'
csv_file_path = os.path.join( output_dir, 'new_gigs.csv' )
model_path = os.path.join( output_dir, 'price_model.pkl' )

if not os.path.exists( output_dir ):
    os.makedirs( output_dir )


def load_data(csv_path):
    if not os.path.exists( csv_path ):
        print( f"CSV file {csv_path} does not exist." )
        return pd.DataFrame( columns=['Title', 'Tags', 'Price'] )

    data = pd.read_csv( csv_path, header=None, names=['Title', 'Tags', 'Price'] )
    if data.empty:
        print( f"CSV file {csv_path} is empty." )
    else:
        data.dropna( inplace=True )
    return data

#RandomForestRegressor model training
def train_model(data):
    if data.empty:
        print( "No data available to train the model." )
        return None

    X = data[['Title', 'Tags']]
    y = data['Price']
    X_combined = X['Title'] + ' ' + X['Tags']

    pipeline = Pipeline( [
        ('vectorizer', TfidfVectorizer( stop_words='english', max_features=5000 )),
        ('model', RandomForestRegressor( n_estimators=200, max_depth=10, random_state=42 ))
    ] )

    if len( data ) > 1:
        X_train, X_test, y_train, y_test = train_test_split( X_combined, y, test_size=0.2, random_state=42 )
        pipeline.fit( X_train, y_train )
    else:
        pipeline.fit( X_combined, y )

    return pipeline


def save_model(model, model_path):
    if model is not None:
        joblib.dump( model, model_path )


def suggest_price(model, title, tags):
    new_gig_combined = title + ' ' + tags
    suggested_price = model.predict( [new_gig_combined] )
    return suggested_price[0]


def retrain_model(csv_path, model_path):
    data = load_data( csv_path )
    model = train_model( data )
    save_model( model, model_path )
    if model is not None:
        print( "Model retrained and saved successfully." )


def predict_price(title, tags, model_path):
    if not os.path.exists( model_path ):
        print( f"Model file {model_path} does not exist. Please retrain the model first." )
        return None

    model = joblib.load( model_path )
    return suggest_price( model, title, tags )


# Main function to handle command-line arguments
def main():
    if len( sys.argv ) < 2:
        print( "Usage: python retrain_and_predict.py <action> [<title> <tags>]" )
        sys.exit( 1 )

    action = sys.argv[1]
    if action == "retrain":
        retrain_model( csv_file_path, model_path )
    elif action == "predict":
        if len( sys.argv ) != 4:
            print( "Usage: python retrain_and_predict.py predict <title> <tags>" )
            sys.exit( 1 )
        title = sys.argv[2]
        tags = sys.argv[3]
        price = predict_price( title, tags, model_path )
        if price is not None:
            print( price )
    else:
        print( "Invalid action. Use 'retrain' or 'predict'." )


if __name__ == "__main__":
    main()
