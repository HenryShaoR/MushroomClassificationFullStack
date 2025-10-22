from __future__ import annotations
import base64, io
from typing import List, Tuple

import cloudpickle
from fastapi import FastAPI, Request
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO


CLS_THRESHOLD = 0.3
DET_THRESHOLD = 0.3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cls = YOLO("cls.pt")
det = YOLO("det.pt")
with open("lrm.pkl", "rb") as f:
    lrm = cloudpickle.load(f)


def get_species(idx: int) -> str:
    return ['Agaricus augustus', 'Agaricus xanthodermus', 'Amanita amerirubescens', 'Amanita augusta', 'Amanita brunnescens', 'Amanita calyptroderma', 'Amanita citrina', 'Amanita flavoconia', 'Amanita muscaria', 'Amanita pantherina', 'Amanita persicina', 'Amanita phalloides', 'Amanita rubescens', 'Amanita velosa', 'Apioperdon pyriforme', 'Armillaria borealis', 'Armillaria mellea', 'Armillaria tabescens', 'Artomyces pyxidatus', 'Bjerkandera adusta', 'Bolbitius titubans', 'Boletus edulis', 'Boletus pallidus', 'Boletus reticulatus', 'Boletus rex-veris', 'Calocera viscosa', 'Calycina citrina', 'Cantharellus californicus', 'Cantharellus cibarius', 'Cantharellus cinnabarinus', 'Cerioporus squamosus', 'Cetraria islandica', 'Chlorociboria aeruginascens', 'Chlorophyllum brunneum', 'Chlorophyllum molybdites', 'Chondrostereum purpureum', 'Cladonia fimbriata', 'Cladonia rangiferina', 'Cladonia stellaris', 'Clitocybe nebularis', 'Clitocybe nuda', 'Coltricia perennis', 'Coprinellus disseminatus', 'Coprinellus micaceus', 'Coprinopsis atramentaria', 'Coprinopsis lagopus', 'Coprinus comatus', 'Crucibulum laeve', 'Cryptoporus volvatus', 'Daedaleopsis confragosa', 'Daedaleopsis tricolor', 'Entoloma abortivum', 'Evernia mesomorpha', 'Evernia prunastri', 'Flammulina velutipes', 'Fomes fomentarius', 'Fomitopsis betulina', 'Fomitopsis mounceae', 'Fomitopsis pinicola', 'Galerina marginata', 'Ganoderma applanatum', 'Ganoderma curtisii', 'Ganoderma oregonense', 'Ganoderma tsugae', 'Gliophorus psittacinus', 'Gloeophyllum sepiarium', 'Graphis scripta', 'Grifola frondosa', 'Gymnopilus luteofolius', 'Gyromitra esculenta', 'Gyromitra gigas', 'Gyromitra infula', 'Hericium coralloides', 'Hericium erinaceus', 'Hygrophoropsis aurantiaca', 'Hypholoma fasciculare', 'Hypholoma lateritium', 'Hypogymnia physodes', 'Hypomyces lactifluorum', 'Imleria badia', 'Inonotus obliquus', 'Ischnoderma resinosum', 'Kuehneromyces mutabilis', 'Laccaria ochropurpurea', 'Lactarius deliciosus', 'Lactarius torminosus', 'Lactarius turpis', 'Laetiporus sulphureus', 'Leccinum albostipitatum', 'Leccinum aurantiacum', 'Leccinum scabrum', 'Leccinum versipelle', 'Lepista nuda', 'Leratiomyces ceres', 'Leucoagaricus americanus', 'Leucoagaricus leucothites', 'Lobaria pulmonaria', 'Lycogala epidendrum', 'Lycoperdon perlatum', 'Lycoperdon pyriforme', 'Macrolepiota procera', 'Merulius tremellosus', 'Mutinus ravenelii', 'Mycena haematopus', 'Mycena leaiana', 'Nectria cinnabarina', 'Omphalotus illudens', 'Omphalotus olivascens', 'Panaeolus papilionaceus', 'Panellus stipticus', 'Parmelia sulcata', 'Paxillus involutus', 'Peltigera aphthosa', 'Peltigera praetextata', 'Phaeolus schweinitzii', 'Phaeophyscia orbicularis', 'Phallus impudicus', 'Phellinus igniarius', 'Phellinus tremulae', 'Phlebia radiata', 'Phlebia tremellosa', 'Pholiota aurivella', 'Pholiota squarrosa', 'Phyllotopsis nidulans', 'Physcia adscendens', 'Platismatia glauca', 'Pleurotus ostreatus', 'Pleurotus pulmonarius', 'Psathyrella candolleana', 'Pseudevernia furfuracea', 'Pseudohydnum gelatinosum', 'Psilocybe azurescens', 'Psilocybe caerulescens', 'Psilocybe cubensis', 'Psilocybe cyanescens', 'Psilocybe ovoideocystidiata', 'Psilocybe pelliculosa', 'Retiboletus ornatipes', 'Rhytisma acerinum', 'Sarcomyxa serotina', 'Sarcoscypha austriaca', 'Sarcosoma globosum', 'Schizophyllum commune', 'Stereum hirsutum', 'Stereum ostrea', 'Stropharia aeruginosa', 'Stropharia ambigua', 'Suillus americanus', 'Suillus granulatus', 'Suillus grevillei', 'Suillus luteus', 'Suillus spraguei', 'Tapinella atrotomentosa', 'Trametes betulina', 'Trametes gibbosa', 'Trametes hirsuta', 'Trametes ochracea', 'Trametes versicolor', 'Tremella mesenterica', 'Trichaptum biforme', 'Tricholoma murrillianum', 'Tricholomopsis rutilans', 'Tylopilus felleus', 'Tylopilus rubrobrunneus', 'Urnula craterium', 'Verpa bohemica', 'Volvopluteus gloiocephalus', 'Vulpicida pinastri', 'Xanthoria parietina'][idx]

def is_poisonous(idx: int) -> bool:
    return [False, True, False, True, True, True, True, True, True, True, True, True, False, True, False, False, False, False, False, False, False, False, False, False, False, False, True, False, False, False, False, False, False, True, True, False, False, False, False, True, True, False, False, False, True, False, False, False, False, False, False, True, False, False, False, False, False, False, False, True, False, False, False, False, False, False, False, False, True, True, True, True, False, False, False, True, True, False, False, False, False, False, False, False, False, True, True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, True, True, False, False, False, True, False, False, False, False, True, False, False, False, False, True, True, False, False, False, False, False, False, False, False, True, True, True, True, True, True, False, False, False, False, False, False, False, False, True, True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, True, True, False, True, False, False, False][idx]

def decode_image_to_pil(image: str) -> Image.Image:
    if image.startswith("data:"):
        image = image.split(",", 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(image))).convert("RGB")

@app.post("/detect")
async def detect(request: Request) -> List[Tuple[int, int, int, int]]:
    """
    :param request: HTTP POST request
    :return: list of (left, top, right, bottom)
    """
    body = await request.json()
    image: str = body.get("image")
    if not image:
        return []
    im = decode_image_to_pil(image)
    results = det(im, verbose=False)
    out = []
    for r in results:
        for x1, y1, x2, y2 in r.boxes.xyxy.cpu().tolist():
            out.append((int(x1), int(y1), int(x2), int(y2)))
    return out

@app.post("/analyze")
async def analyze(request: Request) -> List[Tuple[str, int, int, int, int, float, bool]]:
    """
    :param request: HTTP POST request
    :return: list of (species, left, top, right, bottom, confidence, is_poisonous)
    """
    body = await request.json()
    image: str = body.get("image")
    if not image:
        return []
    im = decode_image_to_pil(image)
    det_results = det(im, verbose=False)
    out = []
    for r in det_results:
        for x1, y1, x2, y2 in r.boxes.xyxy.cpu().tolist():
            crop = im.crop((x1, y1, x2, y2))
            cls_res = cls(crop, verbose=False)
            if cls_res and getattr(cls_res[0], "probs", None):
                probs = cls_res[0].probs
                if probs.top1 is not None:
                    idx = int(probs.top1)
                    species = get_species(idx)
                    prob = float(getattr(probs, "top1conf", probs.data.max().item()))
                    if prob >= CLS_THRESHOLD:
                        out.append((species, int(x1), int(y1), int(x2), int(y2), prob, is_poisonous(idx)))
    return out

@app.post("/lr")
async def linear_regression(request: Request) -> float:
    """
    :param request: HTTP POST request
    :return: prob of is_poisonous
    """
    return lrm.predict_from_partial(await request.json())
