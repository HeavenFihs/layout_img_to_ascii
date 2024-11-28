import os

def get_archs(path):
    archs = []
    for ele in os.listdir(path):
        if os.path.isfile(path+ele):
            archs.append(path+ele)
        else:
            archs += get_archs(path+ele+"/")
    return archs
